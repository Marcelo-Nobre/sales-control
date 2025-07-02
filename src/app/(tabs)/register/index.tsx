import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, SafeAreaView, useColorScheme, useWindowDimensions } from 'react-native';
import { addRevendedor, forceRefresh } from '../../../lib/data';
import { useRouter } from 'expo-router';
import Colors, { getContrastingTextColor } from '../../../constants/Colors';
import BackgroundBubbles from '../../../components/BackgroundBubbles';
import CustomModal from '../../../components/CustomModal';
import { useCustomModal } from '../../../hooks/useCustomModal';
import {
  formatCPF,
  formatPhone,
  validateName,
  validateCPF,
  validatePhone,
  getNameError,
  getCPFError,
  getPhoneError,
  getAddressError
} from '../../../lib/validation';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [errors, setErrors] = useState<{ nome?: string; cpf?: string; telefone?: string; endereco?: string }>({});

  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const { modalConfig, showSuccess, showError } = useCustomModal();

  // Calcular tamanhos responsivos
  const getContainerPadding = () => {
    if (width >= 1200) return 32; // Tablets grandes
    if (width >= 768) return 24; // Tablets
    return 16; // Celulares
  };

  const getInputHeight = () => {
    if (width >= 1200) return 56; // Tablets grandes
    if (width >= 768) return 48; // Tablets
    return 44; // Celulares
  };

  const getFontSize = () => {
    if (width >= 1200) return { label: 18, input: 18, button: 18 }; // Tablets grandes
    if (width >= 768) return { label: 16, input: 16, button: 16 }; // Tablets
    return { label: 16, input: 16, button: 16 }; // Celulares
  };

  const containerPadding = getContainerPadding();
  const inputHeight = getInputHeight();
  const fontSize = getFontSize();

  const handleNomeChange = (text: string) => {
    setNome(text);
    if (errors.nome) {
      setErrors(prev => ({ ...prev, nome: undefined }));
    }
  };

  const handleCpfChange = (text: string) => {
    const formatted = formatCPF(text);
    setCpf(formatted);
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: undefined }));
    }
  };

  const handleTelefoneChange = (text: string) => {
    const formatted = formatPhone(text);
    setTelefone(formatted);
    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: undefined }));
    }
  };

  const handleEnderecoChange = (text: string) => {
    setEndereco(text);
    if (errors.endereco) {
      setErrors(prev => ({ ...prev, endereco: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { nome?: string; cpf?: string; telefone?: string; endereco?: string } = {};

    const nomeError = getNameError(nome);
    if (nomeError) newErrors.nome = nomeError;

    const cpfError = getCPFError(cpf);
    if (cpfError) newErrors.cpf = cpfError;

    const telefoneError = getPhoneError(telefone);
    if (telefoneError) newErrors.telefone = telefoneError;

    const enderecoError = getAddressError(endereco);
    if (enderecoError) newErrors.endereco = enderecoError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      showError('Erro de Validação', 'Por favor, corrija os erros nos campos.');
      return;
    }

    try {
      await addRevendedor({
        nome: nome.trim(),
        cpf,
        telefone,
        endereco: endereco.trim(),
      });
      await forceRefresh();

      // Limpar campos
      setNome('');
      setCpf('');
      setTelefone('');
      setEndereco('');

      // Navegar primeiro, depois mostrar alerta
      router.replace('/(tabs)/active');

      // Mostrar alerta após um pequeno delay para garantir que a navegação aconteceu
      setTimeout(() => {
        showSuccess('Sucesso', 'Revendedor cadastrado com sucesso!');
      }, 100);

    } catch (error: any) {
      showError('Erro', error.message || 'Erro ao cadastrar revendedor.');
    }
  };

  return (
    <BackgroundBubbles>
      <View style={[styles.container, { padding: containerPadding }]}>
        <Text style={[styles.label, { color: theme.text, fontSize: fontSize.label }]}>Nome Completo</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.text,
              borderColor: errors.nome ? theme.buttonDanger : theme.border,
              height: inputHeight,
              fontSize: fontSize.input,
            }
          ]}
          placeholder="Nome do revendedor"
          placeholderTextColor={theme.tabIconDefault}
          value={nome}
          onChangeText={handleNomeChange}
        />
        {errors.nome && <Text style={[styles.errorText, { color: theme.buttonDanger }]}>{errors.nome}</Text>}

        <Text style={[styles.label, { color: theme.text, fontSize: fontSize.label }]}>CPF</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.text,
              borderColor: errors.cpf ? theme.buttonDanger : theme.border,
              height: inputHeight,
              fontSize: fontSize.input,
            }
          ]}
          placeholder="123.456.789-00"
          placeholderTextColor={theme.tabIconDefault}
          value={cpf}
          onChangeText={handleCpfChange}
          keyboardType="numeric"
          maxLength={14}
        />
        {errors.cpf && <Text style={[styles.errorText, { color: theme.buttonDanger }]}>{errors.cpf}</Text>}

        <Text style={[styles.label, { color: theme.text, fontSize: fontSize.label }]}>Telefone</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.text,
              borderColor: errors.telefone ? theme.buttonDanger : theme.border,
              height: inputHeight,
              fontSize: fontSize.input,
            }
          ]}
          placeholder="(11) 99999-8888"
          placeholderTextColor={theme.tabIconDefault}
          value={telefone}
          onChangeText={handleTelefoneChange}
          keyboardType="phone-pad"
          maxLength={15}
        />
        {errors.telefone && <Text style={[styles.errorText, { color: theme.buttonDanger }]}>{errors.telefone}</Text>}

        <Text style={[styles.label, { color: theme.text, fontSize: fontSize.label }]}>Endereço</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBackground,
              color: theme.text,
              borderColor: errors.endereco ? theme.buttonDanger : theme.border,
              height: inputHeight,
              fontSize: fontSize.input,
            }
          ]}
          placeholder="Endereço completo"
          placeholderTextColor={theme.tabIconDefault}
          value={endereco}
          onChangeText={handleEnderecoChange}
        />
        {errors.endereco && <Text style={[styles.errorText, { color: theme.buttonDanger }]}>{errors.endereco}</Text>}

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={handleRegister}>
          <Text style={[styles.buttonText, { color: getContrastingTextColor(colorScheme), fontSize: fontSize.button }]}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      {modalConfig && (
        <CustomModal
          visible={!!modalConfig}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          onConfirm={modalConfig.onConfirm}
          onCancel={modalConfig.onCancel}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          showCancel={modalConfig.showCancel}
        />
      )}
    </BackgroundBubbles>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 4,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
