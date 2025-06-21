import React, { useState, useMemo } from 'react';
import { FlatList, View, StyleSheet, Text, SafeAreaView } from 'react-native';
import ResellerCard from '../../../components/ResellerCard';
import { getRevendedores } from '../../../lib/data';
import SearchBar from '../../../components/SearchBar';

export default function ActiveResellersScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const activeResellers = getRevendedores('ativo');

    const filteredResellers = useMemo(() => {
        return activeResellers.filter((reseller) =>
            reseller.nome.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeResellers, searchQuery]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Revendedores Ativos</Text>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar revendedor..." />

            <FlatList
                data={filteredResellers}
                renderItem={({ item }) => <ResellerCard revendedor={item} />}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginBottom: 10,
    },
});
