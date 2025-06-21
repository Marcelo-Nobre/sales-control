import React, { useState } from 'react';
import { TextInput, StyleSheet, Alert, Pressable, SafeAreaView, useColorScheme } from 'react-native';
import { addRevendedor } from '../../../lib/data';
import { useRouter } from 'expo-router';
import { Text, View } from '../../../components/Themed'; // Import themed components
import Colors from '../../../constants/Colors'; // Import Colors for direct use

export default function RegisterScreen() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const router = useRouter();
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

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

    // Dynamic styles for components that don't use Themed components directly or need specific theme adjustments
    const dynamicStyles = StyleSheet.create({
        input: {
            height: 44,
            borderColor: themeColors.tabIconDefault, // Use a theme color for border
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 16,
            paddingHorizontal: 12,
            fontSize: 16,
            backgroundColor: themeColors.background, // Use theme background
            color: themeColors.text, // Use theme text color
        },
        button: {
            backgroundColor: themeColors.tint, // Use theme tint for button background
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 16,
        },
        buttonText: {
            color: themeColors.background, // For high contrast with tint background
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
            <View style={styles.container}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                    style={dynamicStyles.input}
                    placeholder="Nome do revendedor"
                    value={nome}
                    onChangeText={setNome}
                    placeholderTextColor={themeColors.tabIconDefault}
                />

                <Text style={styles.label}>CPF</Text>
                <TextInput
                    style={dynamicStyles.input}
                    placeholder="123.456.789-00"
                    value={cpf}
                    onChangeText={setCpf}
                    placeholderTextColor={themeColors.tabIconDefault}
                />

                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={dynamicStyles.input}
                    placeholder="(11) 99999-8888"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                    placeholderTextColor={themeColors.tabIconDefault}
                />

                <Pressable style={dynamicStyles.button} onPress={handleRegister}>
                    <Text style={dynamicStyles.buttonText}>Cadastrar</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // backgroundColor is now handled by Themed.View or SafeAreaView
    },
    label: { // Will use Themed.Text, so color is automatic
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    // Input and button styles are now dynamic or will be handled by themed components if available
});
