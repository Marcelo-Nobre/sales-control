import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, SafeAreaView, Text, FlatList, useColorScheme } from 'react-native';
import { Revendedor } from '../lib/data';
import ResellerCard from './ResellerCard';
import SearchBar from './SearchBar';
import EmptyListMessage from './EmptyListMessage';
import BackgroundBubbles from './BackgroundBubbles';
import PaginationControls from './PaginationControls';
import SyncStatus from './SyncStatus';
import Colors, { getContrastingTextColor } from '../constants/Colors';
import EditScreen from '../app/edit/[id]';

type ResellerListLayoutProps = {
  listTitle: string;
  resellers: Revendedor[];
  emptyListIcon: React.ComponentProps<typeof EmptyListMessage>['iconName'];
  emptyListMessage: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  isOffline?: boolean;
  isSyncing?: boolean;
  lastSync?: Date;
};

const TABLET_BREAKPOINT = 768;
const LARGE_TABLET_BREAKPOINT = 1200;

export default function ResellerListLayout({
  listTitle,
  resellers,
  emptyListIcon,
  emptyListMessage,
  refreshing,
  onRefresh,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  isOffline = false,
  isSyncing = false,
  lastSync
}: ResellerListLayoutProps) {
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isTablet = width >= TABLET_BREAKPOINT;
  const isLargeTablet = width >= LARGE_TABLET_BREAKPOINT;

  // Calcular proporções baseadas no tamanho da tela
  const getListWidth = () => {
    if (isLargeTablet) {
      return Math.min(500, width * 0.35); // 35% da largura para tablets grandes
    }
    if (isTablet) {
      return Math.min(450, width * 0.4); // 40% da largura para tablets
    }
    return width; // Largura total para celulares
  };

  const getDetailWidth = () => {
    if (isLargeTablet) {
      return width * 0.65; // 65% da largura para tablets grandes
    }
    if (isTablet) {
      return width * 0.6; // 60% da largura para tablets
    }
    return 0; // Não aplicável para celulares
  };

  // Limpa a seleção quando a lista de revendedores mudar
  useEffect(() => {
    setSelectedId(null);
  }, [resellers]);

  const filteredResellers = (resellers ?? []).filter(r => r.nome.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectReseller = (id: string) => {
    setSelectedId(id);
  };

  const renderDetailView = () => {
    if (selectedId) {
      return <EditScreen tabletId={selectedId} />;
    }
    return (
      <View style={[styles.placeholderContainer, { backgroundColor: theme.background }]}>
        <EmptyListMessage iconName="hand-pointer-o" message="Selecione um revendedor para ver os detalhes." />
      </View>
    );
  };

  const listView = (
    <View style={[
      isTablet ? { width: getListWidth() } : { flex: 1 },
      styles.listContainer
    ]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{listTitle}</Text>
        <View style={styles.titleInfo}>
          <View style={[styles.countBadge, { backgroundColor: theme.tint }]}>
            <Text style={[styles.countText, { color: getContrastingTextColor(colorScheme) }]}>
              {filteredResellers.length}
            </Text>
          </View>
          {isOffline && (
            <View style={[styles.offlineBadge, { backgroundColor: theme.buttonDanger }]}>
              <Text style={[styles.offlineText, { color: 'white' }]}>Offline</Text>
            </View>
          )}
        </View>
      </View>

      <SyncStatus
        isOffline={isOffline}
        isSyncing={isSyncing}
        lastSync={lastSync}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar revendedor..."
      />

      <FlatList
        data={filteredResellers}
        renderItem={({ item }) => (
          <ResellerCard
            revendedor={item}
            isTablet={isTablet}
            onPress={() => handleSelectReseller(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyListMessage iconName={emptyListIcon} message={searchQuery ? 'Nenhum resultado.' : emptyListMessage} />
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {!searchQuery && onPageChange && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          loading={loading}
          itemCount={resellers.length}
        />
      )}
    </View>
  );

  return (
    <BackgroundBubbles>
      <View style={[styles.mainContainer, { backgroundColor: 'transparent' }]}>
        {isTablet ? (
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {listView}
            <View style={[
              styles.detailContainer,
              {
                borderLeftColor: theme.border,
                width: getDetailWidth()
              }
            ]}>
              {renderDetailView()}
            </View>
          </View>
        ) : (
          listView
        )}
      </View>
    </BackgroundBubbles>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    minWidth: 300, // Largura mínima para a lista
  },
  detailContainer: {
    flex: 1,
    borderLeftWidth: 1,
    minWidth: 400, // Largura mínima para o painel de detalhes
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  countText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  offlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  offlineText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
