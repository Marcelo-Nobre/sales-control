import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ResellerListLayout from '../../../components/ResellerListLayout';
import { getRevendedores, getAllRevendedores, syncWhenOnline, forceRefresh } from '../../../lib/data';
import { useOfflineSync } from '../../../hooks/useOfflineSync';
import type { Revendedor } from '../../../lib/data';

const ITEMS_PER_PAGE = 15;

export default function ActiveResellersScreen() {
    const [activeResellers, setActiveResellers] = useState<Revendedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [lastSync, setLastSync] = useState<Date | undefined>();

    const { isOffline, isSyncing, sync } = useOfflineSync(() => {
      // Callback chamada quando sincronização é completada
      setLastSync(new Date());
    });

    const fetchData = useCallback(async (page: number = 1) => {
        setLoading(true);
        try {
            if (!isOffline) {
                // Online: usar paginação
                const data = await getRevendedores('ativo', page);
                setActiveResellers(data);

                // Lógica corrigida para paginação baseada na API
                if (data.length === ITEMS_PER_PAGE) {
                    // Se recebeu exatamente 15 itens, há pelo menos mais uma página
                    setTotalPages(prev => Math.max(prev, page + 1));
                } else if (data.length < ITEMS_PER_PAGE) {
                    // Se recebeu menos de 15 itens, esta é a última página
                    setTotalPages(page);
                } else if (data.length === 0 && page > 1) {
                    // Se recebeu 0 itens e não é a primeira página, a página anterior era a última
                    setTotalPages(page - 1);
                }
            } else {
                // Offline: buscar todos os dados em cache
                const allData = await getAllRevendedores('ativo');
                setActiveResellers(allData);
                setTotalPages(1);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [isOffline]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        fetchData(page);
    }, [fetchData]);

    // Atualiza quando a tela receber foco (após navegação)
    useFocusEffect(
        useCallback(() => {
            fetchData(currentPage);
        }, [fetchData, currentPage])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await forceRefresh();
            await fetchData(currentPage);
            await sync();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setRefreshing(false);
        }
    }, [fetchData, currentPage, sync]);

    if (loading && activeResellers.length === 0) {
        return (
            <ResellerListLayout
                listTitle="Revendedores Ativos"
                resellers={[]}
                emptyListIcon="spinner"
                emptyListMessage="Carregando..."
                refreshing={refreshing}
                onRefresh={onRefresh}
                isOffline={isOffline}
                isSyncing={isSyncing}
                lastSync={lastSync}
            />
        );
    }

    if (error && activeResellers.length === 0) {
        return (
            <ResellerListLayout
                listTitle="Revendedores Ativos"
                resellers={[]}
                emptyListIcon="exclamation-triangle"
                emptyListMessage={`Erro: ${error}`}
                refreshing={refreshing}
                onRefresh={onRefresh}
                isOffline={isOffline}
                isSyncing={isSyncing}
                lastSync={lastSync}
            />
        );
    }

    return (
        <ResellerListLayout
            listTitle="Revendedores Ativos"
            resellers={activeResellers}
            emptyListIcon="check-circle-o"
            emptyListMessage="Não há revendedores ativos no momento."
            refreshing={refreshing}
            onRefresh={onRefresh}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
            isOffline={isOffline}
            isSyncing={isSyncing}
            lastSync={lastSync}
        />
    );
}
