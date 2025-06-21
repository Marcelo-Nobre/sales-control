import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Revendedor } from '../lib/data';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type ResellerCardProps = {
  revendedor: Revendedor;
};

export default function ResellerCard({ revendedor }: ResellerCardProps) {
  return (
    <Link href={`/edit/${revendedor.id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{revendedor.nome}</Text>
          <Text style={styles.details}>CPF: {revendedor.cpf}</Text>
          <Text style={styles.details}>Telefone: {revendedor.telefone}</Text>
        </View>
        <FontAwesome name="chevron-right" size={16} color="#ccc" />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});
