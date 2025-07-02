import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncWhenOnline } from '../lib/data';

export function useOfflineSync(onSyncComplete?: () => void) {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Verificar estado inicial
    const checkInitialState = async () => {
      const state = await NetInfo.fetch();
      const online = state.isConnected && state.isInternetReachable !== false;
      console.log('Estado inicial da conectividade:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        online
      });
      setIsOffline(!online);
    };

    checkInitialState();

    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable !== false;
      console.log('Mudança na conectividade:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        online
      });
      setIsOffline(!online);

      if (online) {
        // Tentar sincronizar quando voltar online
        handleSync();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSync = async () => {
    if (isOffline) return;

    setIsSyncing(true);
    try {
      await syncWhenOnline();
      // Chamar callback se fornecida
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOffline,
    isSyncing,
    sync: handleSync,
  };
}
