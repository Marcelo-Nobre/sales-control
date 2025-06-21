import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ResellerCard from '../../../components/ResellerCard';
import { getRevendedores } from '../../../lib/data';
import SearchBar from '../../../components/SearchBar';
import { Text, View } from '../../../components/Themed'; // Import themed components

export default function InactiveResellersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const inactiveResellers = getRevendedores('inativo');

  const filteredResellers = useMemo(() => {
    return inactiveResellers.filter((reseller) =>
      reseller.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inactiveResellers, searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Revendedores Inativos</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar revendedor..." />
        <FlatList
          data={filteredResellers}
          renderItem={({ item }) => <ResellerCard revendedor={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is now handled by Themed.View
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 10, // Added margin top for better spacing with SafeAreaView
  },
});
