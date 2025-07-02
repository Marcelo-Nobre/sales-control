import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, SafeAreaView, useColorScheme, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getRevendedorById, getRevendedorByIdForceRefresh, Revendedor, updateRevendedor, deleteRevendedor, ativarRevendedor, inativarRevendedor, forceRefresh } from '../../lib/data';
import Colors, { getContrastingTextColor } from '../../constants/Colors';
import BackgroundBubbles from '../../components/BackgroundBubbles';
import CustomModal from '../../components/CustomModal';
import { useCustomModal } from '../../hooks/useCustomModal';
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
} from '../../lib/validation';
import EmptyListMessage from '../../components/EmptyListMessage';

type EditScreenProps = {
  tabletId?: string;
};

export default function EditScreen({ tabletId }: EditScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const { modalConfig, showSuccess, showError, showConfirm } = useCustomModal();

  // Use tabletId if provided (for tablet view), otherwise use the route param
  const id = tabletId || params.id;

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

  const [revendedor, setRevendedor] = useState<Revendedor | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [errors, setErrors] = useState<{ nome?: string; cpf?: string; telefone?: string; endereco?: string }>({});
  const [loading, setLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);

  // Verifica se o formulário foi modificado
  useEffect(() => {
    if (revendedor) {
      const unformattedCpf = cpf.replace(/[.\-]/g, '');
      const originalCpf = revendedor.cpf.replace(/[.\-]/g, '');
      const unformattedTelefone = telefone.replace(/[()\s\-]/g, '');
      const originalTelefone = revendedor.telefone.replace(/[()\s\-]/g, '');

      const hasChanged =
        nome.trim() !== revendedor.nome ||
        unformattedCpf !== originalCpf ||
        unformattedTelefone !== originalTelefone ||
        endereco.trim() !== revendedor.endereco;

      setIsModified(hasChanged);
    }
  }, [nome, cpf, telefone, endereco, revendedor]);

  // Recarregar dados quando a tela receber foco (após navegação)
  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        setLoading(true);
        getRevendedorByIdForceRefresh(id).then((res) => {
          if (res) {
            setRevendedor(res);
            setNome(res.nome);
            setCpf(formatCPF(res.cpf));
            setTelefone(formatPhone(res.telefone));
            setEndereco(res.endereco);
            setIsModified(false); // Reseta o estado de modificação
          }
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      }
    }, [id])
  );

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

  const handleUpdate = async () => {
    if (!id) return;

    if (!validateForm()) {
      showError('Erro de Validação', 'Por favor, corrija os erros nos campos.');
      return;
    }

    try {
      await updateRevendedor(id, {
        nome: nome.trim(),
        cpf,
        telefone,
        endereco: endereco.trim(),
      });
      await forceRefresh();

      // Buscar dados atualizados para verificar o status real
      const updatedRevendedor = await getRevendedorByIdForceRefresh(id);

      // Redirecionar baseado no status atualizado ANTES do alerta
      if (updatedRevendedor?.status === 'ativo') {
        router.replace('/(tabs)/active');
      } else {
        router.replace('/(tabs)/inactive');
      }

      // Mostrar alerta após um pequeno delay para garantir que a navegação aconteceu
      setTimeout(() => {
        showSuccess('Sucesso', 'Dados atualizados com sucesso!');
      }, 100);

    } catch (error: any) {
      showError('Erro', error.message || 'Erro ao atualizar revendedor.');
    }
  };

  const handleChangeStatus = async (status: 'ativo' | 'inativo') => {
    if (!id) return;

    try {
      if (status === 'ativo') {
        await ativarRevendedor(id);
      } else {
        await inativarRevendedor(id);
      }
      await forceRefresh();

      // Buscar dados atualizados para verificar o status real
      const updatedRevendedor = await getRevendedorByIdForceRefresh(id);

      // Redirecionar baseado no status atualizado ANTES do alerta
      if (updatedRevendedor?.status === 'ativo') {
        router.replace('/(tabs)/active');
      } else {
        router.replace('/(tabs)/inactive');
      }

      // Mostrar alerta após um pequeno delay para garantir que a navegação aconteceu
      setTimeout(() => {
        showSuccess('Sucesso', `Status alterado para ${status} com sucesso!`);
      }, 100);

    } catch (error: any) {
      showError('Erro', error.message || 'Erro ao alterar status do revendedor.');
    }
  };

  const handleDelete = () => {
    if (!id) return;

    showConfirm(
      'Confirmar Exclusão',
      `Tem certeza de que deseja excluir "${revendedor?.nome}"? Esta ação não pode ser desfeita.`,
      async () => {
        try {
          await deleteRevendedor(id);
          await forceRefresh();

          // Limpa o estado local para que a UI atualize para "não encontrado"
          setRevendedor(null);

          // Navegar de volta para a lista correta baseada no status atual
          if (revendedor?.status === 'ativo') {
            router.replace('/(tabs)/active');
          } else {
            router.replace('/(tabs)/inactive');
          }

          // Mostrar alerta após um pequeno delay para garantir que a navegação aconteceu
          setTimeout(() => {
            showSuccess('Sucesso', 'Revendedor excluído com sucesso!');
          }, 100);

        } catch (error: any) {
          showError('Erro', error.message || 'Erro ao excluir revendedor.');
        }
      },
      undefined,
      'Excluir',
      'Cancelar'
    );
  };

  if (loading) {
    return (
      <BackgroundBubbles>
        <View style={styles.container}>
          <EmptyListMessage iconName="spinner" message="Carregando..." />
        </View>
      </BackgroundBubbles>
    );
  }

  if (!revendedor) {
    return (
      <BackgroundBubbles>
        <View style={styles.container}>
          <EmptyListMessage
            iconName="exclamation-triangle"
            message="Revendedor não encontrado ou foi removido."
          />
        </View>
      </BackgroundBubbles>
    );
  }

  return (
    <BackgroundBubbles>
      <View style={[styles.container, { padding: containerPadding }]}>
        <Text style={[styles.label, { color: theme.text, fontSize: fontSize.label }]}>Nome</Text>
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
          value={nome}
          onChangeText={handleNomeChange}
          placeholderTextColor={theme.tabIconDefault}
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
          value={cpf}
          onChangeText={handleCpfChange}
          placeholderTextColor={theme.tabIconDefault}
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
          value={telefone}
          onChangeText={handleTelefoneChange}
          placeholderTextColor={theme.tabIconDefault}
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
          value={endereco}
          onChangeText={handleEnderecoChange}
          placeholderTextColor={theme.tabIconDefault}
        />
        {errors.endereco && <Text style={[styles.errorText, { color: theme.buttonDanger }]}>{errors.endereco}</Text>}

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.tint,
              opacity: !isModified ? 0.5 : 1,
              marginTop: 20,
            }
          ]}
          onPress={handleUpdate}
          disabled={!isModified}
        >
          <Text style={[styles.buttonText, { color: getContrastingTextColor(colorScheme), fontSize: fontSize.button }]}>Salvar Alterações</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <View style={styles.buttonContainer}>
          {revendedor.status === 'ativo' ? (
            <TouchableOpacity style={[styles.button, styles.buttonFlex, { backgroundColor: theme.buttonDanger }]} onPress={() => handleChangeStatus('inativo')}>
              <Text style={[styles.buttonText, { color: 'white', fontSize: fontSize.button }]}>Inativar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.buttonFlex, { backgroundColor: theme.buttonSuccess }]} onPress={() => handleChangeStatus('ativo')}>
              <Text style={[styles.buttonText, { color: 'white', fontSize: fontSize.button }]}>Ativar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.button, styles.buttonFlex, { backgroundColor: theme.buttonDanger, marginLeft: 10 }]} onPress={handleDelete}>
            <Text style={[styles.buttonText, { color: 'white', fontSize: fontSize.button }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 8
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 20
  },
});
