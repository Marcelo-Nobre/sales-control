import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://arkwjdhbyebackbjkliu.supabase.co/functions/v1/users-crud-rest';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFya3dqZGhieWViYWNrYmprbGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTc1NDgsImV4cCI6MjA2NjE3MzU0OH0.jyTTYZb8I-cLK9WW7w1ad9grv70gOTaLwtOF9zsok1Y';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFya3dqZGhieWViYWNrYmprbGl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU5NzU0OCwiZXhwIjoyMDY2MTczNTQ4fQ.SWXbK-r8R2s5l4loWqbmhHPn2T5j2u-QRBUPkJQfsZY';

// Chaves para AsyncStorage
const CACHE_KEYS = {
  ACTIVE_RESELLERS: 'active_resellers_cache',
  INACTIVE_RESELLERS: 'inactive_resellers_cache',
  LAST_SYNC: 'last_sync_timestamp',
  PENDING_OPERATIONS: 'pending_operations',
  PAGINATION_CACHE: 'pagination_cache',
};

const readHeaders = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

const writeHeaders = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

// Verificar conectividade
async function isOnline(): Promise<boolean> {
  const netInfo = await NetInfo.fetch();
  return (netInfo.isConnected && netInfo.isInternetReachable !== false) ?? false;
}

// Cache local
async function getCachedData(key: string): Promise<any> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao ler cache:', error);
    return null;
  }
}

async function setCachedData(key: string, data: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
}

// Operações pendentes
async function addPendingOperation(operation: {
  type: 'create' | 'update' | 'delete' | 'status_change';
  data: any;
  timestamp: number;
}): Promise<void> {
  try {
    const pending = await getCachedData(CACHE_KEYS.PENDING_OPERATIONS) || [];
    pending.push(operation);
    await setCachedData(CACHE_KEYS.PENDING_OPERATIONS, pending);
  } catch (error) {
    console.error('Erro ao adicionar operação pendente:', error);
  }
}

async function getPendingOperations(): Promise<any[]> {
  return await getCachedData(CACHE_KEYS.PENDING_OPERATIONS) || [];
}

async function clearPendingOperations(): Promise<void> {
  await setCachedData(CACHE_KEYS.PENDING_OPERATIONS, []);
}

// Sincronizar operações pendentes
async function syncPendingOperations(): Promise<void> {
  const pending = await getPendingOperations();
  if (pending.length === 0) return;

  const online = await isOnline();
  if (!online) return;

  for (const operation of pending) {
    try {
      switch (operation.type) {
        case 'create':
          await createUser(operation.data);
          break;
        case 'update':
          await updateUser(operation.data.id, operation.data.updates);
          break;
        case 'delete':
          await deleteUser(operation.data.id);
          break;
        case 'status_change':
          await updateUser(operation.data.id, { is_active: operation.data.is_active });
          break;
      }
    } catch (error) {
      console.error('Erro ao sincronizar operação:', error);
    }
  }

  await clearPendingOperations();
  // Limpar cache após sincronização
  await clearPaginationCache();
}

function mapBackendToRevendedor(user: any): Revendedor {
  return {
    id: String(user.id),
    nome: user.name,
    telefone: user.number_phone,
    cpf: user.cpf,
    status: user.is_active ? 'ativo' : 'inativo',
    endereco: user.address,
  };
}

// Buscar revendedores com paginação
export async function getRevendedores(status: 'ativo' | 'inativo', page: number = 1): Promise<Revendedor[]> {
  const cacheKey = status === 'ativo' ? CACHE_KEYS.ACTIVE_RESELLERS : CACHE_KEYS.INACTIVE_RESELLERS;
  const paginationKey = `${cacheKey}_page_${page}`;

  const online = await isOnline();
  console.log(`[getRevendedores] Buscando ${status}, página ${page}, online: ${online}`);

  // Se offline, buscar todos os dados em cache
  if (!online) {
    const allCached = await getCachedData(cacheKey) || [];
    console.log(`[getRevendedores] Offline - retornando ${allCached.length} itens do cache`);
    return allCached;
  }

  // Verificar se há operações pendentes que podem ter afetado os dados
  const pendingOperations = await getPendingOperations();
  const hasRecentOperations = pendingOperations.some(op =>
    Date.now() - op.timestamp < 5 * 60 * 1000 // 5 minutos
  );

  // Se há operações recentes, não usar cache de paginação
  if (hasRecentOperations) {
    console.log(`[getRevendedores] Operações recentes detectadas, buscando da API`);
    try {
      const response = await fetch(`${BASE_URL}?q=${page}`, {
        headers: readHeaders,
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar revendedores: ${response.status}`);
      }

      const users = await response.json();
      console.log(`[getRevendedores] API retornou ${users.length} usuários para página ${page}`);

      const filteredUsers = Array.isArray(users)
        ? users.filter((u: any) => (status === 'ativo' ? u.is_active : !u.is_active)).map(mapBackendToRevendedor)
        : [];

      console.log(`[getRevendedores] Após filtro por status '${status}': ${filteredUsers.length} revendedores`);

      // Salvar no cache
      await setCachedData(paginationKey, filteredUsers);
      await setCachedData(CACHE_KEYS.LAST_SYNC, Date.now());

      return filteredUsers;
    } catch (error) {
      console.error('Erro ao buscar revendedores:', error);
      // Retornar dados do cache se disponível
      const fallbackData = await getCachedData(cacheKey) || [];
      return fallbackData;
    }
  }

  // Tentar buscar do cache primeiro
  const cachedData = await getCachedData(paginationKey);
  if (cachedData) {
    console.log(`[getRevendedores] Cache hit para página ${page}: ${cachedData.length} itens`);
    return cachedData;
  }

  try {
    // Buscar da API com paginação
    console.log(`[getRevendedores] Buscando da API: ${BASE_URL}?q=${page}`);
    const response = await fetch(`${BASE_URL}?q=${page}`, {
      headers: readHeaders,
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar revendedores: ${response.status}`);
    }

    const users = await response.json();
    console.log(`[getRevendedores] API retornou ${users.length} usuários para página ${page}`);

    const filteredUsers = Array.isArray(users)
      ? users.filter((u: any) => (status === 'ativo' ? u.is_active : !u.is_active)).map(mapBackendToRevendedor)
      : [];

    console.log(`[getRevendedores] Após filtro por status '${status}': ${filteredUsers.length} revendedores`);

    // Salvar no cache
    await setCachedData(paginationKey, filteredUsers);
    await setCachedData(CACHE_KEYS.LAST_SYNC, Date.now());

    return filteredUsers;
  } catch (error) {
    console.error('Erro ao buscar revendedores:', error);
    // Retornar dados do cache se disponível
    const fallbackData = await getCachedData(cacheKey) || [];
    return fallbackData;
  }
}

// Buscar todos os revendedores (para cache completo)
export async function getAllRevendedores(status: 'ativo' | 'inativo'): Promise<Revendedor[]> {
  const cacheKey = status === 'ativo' ? CACHE_KEYS.ACTIVE_RESELLERS : CACHE_KEYS.INACTIVE_RESELLERS;

  const online = await isOnline();
  console.log(`[getAllRevendedores] Buscando todos os ${status}, online: ${online}`);

  if (!online) {
    const cached = await getCachedData(cacheKey) || [];
    console.log(`[getAllRevendedores] Offline - retornando ${cached.length} itens do cache`);
    return cached;
  }

  try {
    let allUsers: Revendedor[] = [];
    let page = 1;
    let hasMore = true;

    console.log(`[getAllRevendedores] Iniciando busca de todas as páginas`);

    while (hasMore) {
      console.log(`[getAllRevendedores] Buscando página ${page}`);
      const response = await fetch(`${BASE_URL}?q=${page}`, {
        headers: readHeaders,
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar página ${page}: ${response.status}`);
      }

      const users = await response.json();
      console.log(`[getAllRevendedores] Página ${page} retornou ${users.length} usuários`);

      if (!Array.isArray(users) || users.length === 0) {
        console.log(`[getAllRevendedores] Página ${page} vazia, parando busca`);
        hasMore = false;
      } else {
        const filteredUsers = users
          .filter((u: any) => (status === 'ativo' ? u.is_active : !u.is_active))
          .map(mapBackendToRevendedor);

        console.log(`[getAllRevendedores] Página ${page} tem ${filteredUsers.length} revendedores ${status}`);
        allUsers = [...allUsers, ...filteredUsers];
        page++;
      }
    }

    console.log(`[getAllRevendedores] Total de revendedores ${status} encontrados: ${allUsers.length}`);

    // Salvar no cache
    await setCachedData(cacheKey, allUsers);
    await setCachedData(CACHE_KEYS.LAST_SYNC, Date.now());

    return allUsers;
  } catch (error) {
    console.error('Erro ao buscar todos os revendedores:', error);
    return await getCachedData(cacheKey) || [];
  }
}

export type Revendedor = {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  status: 'ativo' | 'inativo';
  endereco: string;
};

// Funções auxiliares para API
async function createUser(user: any) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: writeHeaders,
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao criar usuário: ${response.status} - ${errorText}`);
  }
  return response.json();
}

async function updateUser(id: string, updates: any) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: writeHeaders,
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao atualizar usuário: ${response.status} - ${errorText}`);
  }
  return response.json();
}

async function deleteUser(id: string) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: writeHeaders,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao deletar usuário: ${response.status} - ${errorText}`);
  }
  return response.json();
}

export async function addRevendedor(data: { nome: string; cpf: string; telefone: string; endereco: string }) {
  const payload = {
    name: data.nome,
    cpf: data.cpf,
    address: data.endereco,
    number_phone: data.telefone,
    is_active: true,
  };

  const online = await isOnline();

  if (online) {
    try {
      const response = await createUser(payload);
      // Limpar cache após criação
      await clearPaginationCache();
      return response;
    } catch (error) {
      throw error;
    }
  } else {
    // Salvar operação pendente
    await addPendingOperation({
      type: 'create',
      data: payload,
      timestamp: Date.now(),
    });

    // Adicionar ao cache local
    const newRevendedor: Revendedor = {
      id: `temp_${Date.now()}`,
      nome: data.nome,
      cpf: data.cpf,
      telefone: data.telefone,
      endereco: data.endereco,
      status: 'ativo',
    };

    const cachedActive = await getCachedData(CACHE_KEYS.ACTIVE_RESELLERS) || [];
    cachedActive.push(newRevendedor);
    await setCachedData(CACHE_KEYS.ACTIVE_RESELLERS, cachedActive);

    return newRevendedor;
  }
}

export async function getRevendedorById(id: string): Promise<Revendedor | null> {
  const online = await isOnline();

  // Verificar se há operações pendentes recentes que podem ter afetado este revendedor
  const pendingOperations = await getPendingOperations();
  const hasRecentOperationsForThisId = pendingOperations.some(op =>
    (op.data.id === id || op.data.id === id) &&
    Date.now() - op.timestamp < 5 * 60 * 1000 // 5 minutos
  );

  // Se há operações recentes para este ID e estamos online, buscar da API
  if (hasRecentOperationsForThisId && online) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        headers: readHeaders,
      });
      if (!response.ok) {
        return null;
      }
      const user = await response.json();
      if (!user) return null;
      return mapBackendToRevendedor(user);
    } catch (error) {
      console.error('Erro ao buscar revendedor por ID da API:', error);
      // Fallback para cache se API falhar
    }
  }

  // Primeiro tentar buscar do cache
  const activeCache = await getCachedData(CACHE_KEYS.ACTIVE_RESELLERS) || [];
  const inactiveCache = await getCachedData(CACHE_KEYS.INACTIVE_RESELLERS) || [];

  const fromCache = [...activeCache, ...inactiveCache].find(r => r.id === id);
  if (fromCache) {
    return fromCache;
  }

  if (!online) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: readHeaders,
    });
    if (!response.ok) {
      return null;
    }
    const user = await response.json();
    if (!user) return null;
    return mapBackendToRevendedor(user);
  } catch (error) {
    console.error('Erro ao buscar revendedor por ID:', error);
    return null;
  }
}

export async function updateRevendedor(id: string, data: { nome: string; cpf: string; telefone: string; endereco: string }) {
  const payload = {
    name: data.nome,
    cpf: data.cpf,
    address: data.endereco,
    number_phone: data.telefone,
  };

  const online = await isOnline();

  if (online) {
    try {
      const response = await updateUser(id, payload);
      // Limpar cache após atualização
      await clearPaginationCache();
      return response;
    } catch (error) {
      throw error;
    }
  } else {
    // Salvar operação pendente
    await addPendingOperation({
      type: 'update',
      data: { id, updates: payload },
      timestamp: Date.now(),
    });

    // Atualizar cache local
    const activeCache = await getCachedData(CACHE_KEYS.ACTIVE_RESELLERS) || [];
    const inactiveCache = await getCachedData(CACHE_KEYS.INACTIVE_RESELLERS) || [];

    const allRevendedores = [...activeCache, ...inactiveCache];
    const index = allRevendedores.findIndex(r => r.id === id);

    if (index !== -1) {
      allRevendedores[index] = {
        ...allRevendedores[index],
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
        endereco: data.endereco,
      };

      // Atualizar cache apropriado
      const isActive = allRevendedores[index].status === 'ativo';
      if (isActive) {
        await setCachedData(CACHE_KEYS.ACTIVE_RESELLERS, allRevendedores.filter((r: Revendedor) => r.status === 'ativo'));
      } else {
        await setCachedData(CACHE_KEYS.INACTIVE_RESELLERS, allRevendedores.filter((r: Revendedor) => r.status === 'inativo'));
      }
    }

    return allRevendedores[index];
  }
}

export async function deleteRevendedor(id: string) {
  const online = await isOnline();

  if (online) {
    try {
      const response = await deleteUser(id);
      // Limpar cache após exclusão
      await clearPaginationCache();
      return response;
    } catch (error) {
      throw error;
    }
  } else {
    // Salvar operação pendente
    await addPendingOperation({
      type: 'delete',
      data: { id },
      timestamp: Date.now(),
    });

    // Remover do cache local
    const activeCache = await getCachedData(CACHE_KEYS.ACTIVE_RESELLERS) || [];
    const inactiveCache = await getCachedData(CACHE_KEYS.INACTIVE_RESELLERS) || [];

    const filteredActive = activeCache.filter((r: Revendedor) => r.id !== id);
    const filteredInactive = inactiveCache.filter((r: Revendedor) => r.id !== id);

    await setCachedData(CACHE_KEYS.ACTIVE_RESELLERS, filteredActive);
    await setCachedData(CACHE_KEYS.INACTIVE_RESELLERS, filteredInactive);

    return { success: true };
  }
}

export async function ativarRevendedor(id: string) {
  const online = await isOnline();

  if (online) {
    try {
      const response = await updateUser(id, { is_active: true });
      // Limpar cache após mudança de status
      await clearPaginationCache();
      return response;
    } catch (error) {
      throw error;
    }
  } else {
    // Salvar operação pendente
    await addPendingOperation({
      type: 'status_change',
      data: { id, is_active: true },
      timestamp: Date.now(),
    });

    // Atualizar cache local
    const activeCache = await getCachedData(CACHE_KEYS.ACTIVE_RESELLERS) || [];
    const inactiveCache = await getCachedData(CACHE_KEYS.INACTIVE_RESELLERS) || [];

    const revendedor = inactiveCache.find((r: Revendedor) => r.id === id);
    if (revendedor) {
      revendedor.status = 'ativo';
      const newActiveCache = [...activeCache, revendedor];
      const newInactiveCache = inactiveCache.filter((r: Revendedor) => r.id !== id);

      await setCachedData(CACHE_KEYS.ACTIVE_RESELLERS, newActiveCache);
      await setCachedData(CACHE_KEYS.INACTIVE_RESELLERS, newInactiveCache);
    }

    return revendedor;
  }
}

export async function inativarRevendedor(id: string) {
  const online = await isOnline();

  if (online) {
    try {
      const response = await updateUser(id, { is_active: false });
      // Limpar cache após mudança de status
      await clearPaginationCache();
      return response;
    } catch (error) {
      throw error;
    }
  } else {
    // Salvar operação pendente
    await addPendingOperation({
      type: 'status_change',
      data: { id, is_active: false },
      timestamp: Date.now(),
    });

    // Atualizar cache local
    const activeCache = await getCachedData(CACHE_KEYS.ACTIVE_RESELLERS) || [];
    const inactiveCache = await getCachedData(CACHE_KEYS.INACTIVE_RESELLERS) || [];

    const revendedor = activeCache.find((r: Revendedor) => r.id === id);
    if (revendedor) {
      revendedor.status = 'inativo';
      const newInactiveCache = [...inactiveCache, revendedor];
      const newActiveCache = activeCache.filter((r: Revendedor) => r.id !== id);

      await setCachedData(CACHE_KEYS.ACTIVE_RESELLERS, newActiveCache);
      await setCachedData(CACHE_KEYS.INACTIVE_RESELLERS, newInactiveCache);
    }

    return revendedor;
  }
}

// Função para sincronizar quando voltar online
export async function syncWhenOnline(): Promise<void> {
  const online = await isOnline();
  if (online) {
    await syncPendingOperations();
  }
}

// Função para limpar cache
export async function clearCache(): Promise<void> {
  await clearPaginationCache();
  await AsyncStorage.multiRemove([
    CACHE_KEYS.LAST_SYNC,
    CACHE_KEYS.PENDING_OPERATIONS,
  ]);
}

// Função para limpar cache de paginação
async function clearPaginationCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const paginationKeys = keys.filter(key =>
      key.includes('_page_') ||
      key === CACHE_KEYS.ACTIVE_RESELLERS ||
      key === CACHE_KEYS.INACTIVE_RESELLERS ||
      key === CACHE_KEYS.PAGINATION_CACHE
    );
    if (paginationKeys.length > 0) {
      await AsyncStorage.multiRemove(paginationKeys);
    }
  } catch (error) {
    console.error('Erro ao limpar cache de paginação:', error);
  }
}

// Função para forçar atualização dos dados (invalidar cache)
export async function forceRefresh(): Promise<void> {
  await clearPaginationCache();
}

// Função para forçar busca atualizada de um revendedor específico
export async function getRevendedorByIdForceRefresh(id: string): Promise<Revendedor | null> {
  const online = await isOnline();

  if (online) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        headers: readHeaders,
      });
      if (!response.ok) {
        return null;
      }
      const user = await response.json();
      if (!user) return null;
      return mapBackendToRevendedor(user);
    } catch (error) {
      console.error('Erro ao buscar revendedor por ID da API:', error);
      // Fallback para cache se API falhar
    }
  }

  // Fallback para cache se offline ou API falhar
  const activeCache = await getCachedData(CACHE_KEYS.ACTIVE_RESELLERS) || [];
  const inactiveCache = await getCachedData(CACHE_KEYS.INACTIVE_RESELLERS) || [];

  const fromCache = [...activeCache, ...inactiveCache].find(r => r.id === id);
  return fromCache || null;
}
