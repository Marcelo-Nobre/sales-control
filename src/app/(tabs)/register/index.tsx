import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, Pressable, SafeAreaView } from 'react-native';
import { addRevendedor } from '../../../lib/data';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const router = useRouter();

    const handleRegister = () => {
        if (!nome || !cpf || !telefone) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }
        addRevendedor({
            id: '', // será gerado pela função
            nome,
            cpf,
            telefone,
            status: 'ativo',
        });
        Alert.alert('Sucesso', 'Revendedor cadastrado!');
        router.push('/(tabs)/active');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput style={styles.input} placeholder="Nome do revendedor" value={nome} onChangeText={setNome} />

                <Text style={styles.label}>CPF</Text>
                <TextInput style={styles.input} placeholder="123.456.789-00" value={cpf} onChangeText={setCpf} />

                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={styles.input}
                    placeholder="(11) 99999-8888"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                />

                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </Pressable>
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F9FA',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
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
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
