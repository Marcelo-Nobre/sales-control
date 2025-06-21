import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getById, updateRevendedor, updateStatus, Revendedor } from '../../lib/data';

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [revendedor, setRevendedor] = useState<Revendedor | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (id) {
      const res = getById(id);
      if (res) {
        setRevendedor(res);
        setNome(res.nome);
        setCpf(res.cpf);
        setTelefone(res.telefone);
      }
    }
  }, [id]);

  const handleUpdate = () => {
    if (!id) return;
    updateRevendedor(id, { nome, cpf, telefone });
    Alert.alert('Sucesso', 'Dados atualizados.');
    router.back();
  };

  const handleChangeStatus = (status: 'ativo' | 'inativo') => {
    if (!id) return;
    updateStatus(id, status);
    Alert.alert('Sucesso', `Status alterado para ${status}.`);
    router.back();
  };

  if (!revendedor) {
    return (
      <View style={styles.container}>
        <Text>Revendedor não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />

      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </Pressable>

      <View style={styles.separator} />

      {revendedor.status === 'ativo' ? (
        <Pressable style={[styles.button, styles.buttonDanger]} onPress={() => handleChangeStatus('inativo')}>
          <Text style={styles.buttonText}>Inativar</Text>
        </Pressable>
      ) : (
        <Pressable style={[styles.button, styles.buttonSuccess]} onPress={() => handleChangeStatus('ativo')}>
          <Text style={styles.buttonText}>Ativar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8F9FA' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  buttonDanger: { backgroundColor: '#DC3545' },
  buttonSuccess: { backgroundColor: '#28A745' },
  separator: { marginVertical: 10 },
});
