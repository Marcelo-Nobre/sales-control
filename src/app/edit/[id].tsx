import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Alert, Pressable, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getById, updateRevendedor, updateStatus, Revendedor } from '../../lib/data';
import { Text, View } from '../../components/Themed'; // Import themed components
import Colors from '../../constants/Colors'; // Import Colors for direct use

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [revendedor, setRevendedor] = useState<Revendedor | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

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

  // Dynamic styles
  const dynamicStyles = StyleSheet.create({
    input: {
      height: 44,
      borderColor: themeColors.tabIconDefault,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: themeColors.background,
      color: themeColors.text,
    },
    button: {
      backgroundColor: themeColors.tint,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: themeColors.background, // High contrast with tint
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonDanger: {
      backgroundColor: '#DC3545', // Consider making these theme-aware if needed
    },
    buttonSuccess: {
      backgroundColor: '#28A745', // Consider making these theme-aware if needed
    },
  });

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
      <TextInput
        style={dynamicStyles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor={themeColors.tabIconDefault}
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={dynamicStyles.input}
        value={cpf}
        onChangeText={setCpf}
        placeholderTextColor={themeColors.tabIconDefault}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={dynamicStyles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholderTextColor={themeColors.tabIconDefault}
      />

      <Pressable style={dynamicStyles.button} onPress={handleUpdate}>
        <Text style={dynamicStyles.buttonText}>Salvar Alterações</Text>
      </Pressable>

      <View style={styles.separator} />

      {revendedor.status === 'ativo' ? (
        <Pressable style={[dynamicStyles.button, dynamicStyles.buttonDanger]} onPress={() => handleChangeStatus('inativo')}>
          <Text style={dynamicStyles.buttonText}>Inativar</Text>
        </Pressable>
      ) : (
        <Pressable style={[dynamicStyles.button, dynamicStyles.buttonSuccess]} onPress={() => handleChangeStatus('ativo')}>
          <Text style={dynamicStyles.buttonText}>Ativar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }, // backgroundColor handled by Themed.View
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 }, // color handled by Themed.Text
  separator: { marginVertical: 10 },
  // Other styles moved to dynamicStyles or handled by themed components
});
