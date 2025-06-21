export type Revendedor = {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  status: 'ativo' | 'inativo';
};

export const revendedores: Revendedor[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '11999998888',
    cpf: '123.456.789-00',
    status: 'ativo',
  },
  {
    id: '2',
    nome: 'João Souza',
    telefone: '11988887777',
    cpf: '987.654.321-00',
    status: 'inativo',
  },
];

export function getRevendedores(status: 'ativo' | 'inativo') {
  return revendedores.filter((r) => r.status === status);
}

export function getById(id: string) {
  return revendedores.find((r) => r.id === id);
}

export function updateStatus(id: string, status: 'ativo' | 'inativo') {
  const item = getById(id);
  if (item) item.status = status;
}

export function updateRevendedor(id: string, data: Partial<Revendedor>) {
  const item = getById(id);
  if (item) Object.assign(item, data);
}

export function addRevendedor(data: Revendedor) {
  revendedores.push({ ...data, id: String(Date.now()) });
}

export function inativarTodos() {
  revendedores.forEach((r) => (r.status = 'inativo'));
}
