import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors, { getContrastingTextColor } from '../constants/Colors';

type CustomModalProps = {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

export default function CustomModal({
  visible,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  showCancel = false,
}: CustomModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { width, height } = useWindowDimensions();

  // Calcular tamanhos responsivos
  const getModalWidth = () => {
    if (width >= 1200) return Math.min(500, width * 0.4); // Tablets grandes
    if (width >= 768) return Math.min(450, width * 0.5); // Tablets
    return Math.min(320, width * 0.9); // Celulares
  };

  const getIconSize = () => {
    if (width >= 1200) return 48; // Tablets grandes
    if (width >= 768) return 40; // Tablets
    return 32; // Celulares
  };

  const getTitleSize = () => {
    if (width >= 1200) return 24; // Tablets grandes
    if (width >= 768) return 22; // Tablets
    return 20; // Celulares
  };

  const getMessageSize = () => {
    if (width >= 1200) return 18; // Tablets grandes
    if (width >= 768) return 16; // Tablets
    return 16; // Celulares
  };

  const modalWidth = getModalWidth();
  const iconSize = getIconSize();
  const titleSize = getTitleSize();
  const messageSize = getMessageSize();

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle',
          color: theme.buttonSuccess,
          backgroundColor: theme.buttonSuccess + '20',
        };
      case 'error':
        return {
          icon: 'exclamation-circle',
          color: theme.buttonDanger,
          backgroundColor: theme.buttonDanger + '20',
        };
      case 'warning':
        return {
          icon: 'exclamation-triangle',
          color: '#FFA500',
          backgroundColor: '#FFA50020',
        };
      case 'info':
      default:
        return {
          icon: 'info-circle',
          color: theme.tint,
          backgroundColor: theme.tint + '20',
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[
          styles.modalContainer,
          {
            backgroundColor: theme.background,
            width: modalWidth,
          }
        ]}>
          {/* Ícone */}
          <View style={[styles.iconContainer, { backgroundColor: typeConfig.backgroundColor }]}>
            <FontAwesome
              name={typeConfig.icon as any}
              size={iconSize}
              color={typeConfig.color}
            />
          </View>

          {/* Título */}
          <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>{title}</Text>

          {/* Mensagem */}
          <Text style={[styles.message, { color: theme.textSecondary, fontSize: messageSize }]}>{message}</Text>

          {/* Botões */}
          <View style={[
            styles.buttonContainer,
            !showCancel && { justifyContent: 'center' } // Centraliza se não houver botão de cancelar
          ]}>
            {showCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: theme.textSecondary }]}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor: typeConfig.color,
                  // Se não houver botão de cancelar, o botão de confirmação não deve esticar
                  flex: showCancel ? 1 : 0,
                }
              ]}
              onPress={handleConfirm}
            >
              <Text style={[
                styles.buttonText,
                {
                  color: type === 'warning' ? 'black' : 'white'
                }
              ]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    minWidth: 280,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  confirmButton: {
    // backgroundColor será definido dinamicamente
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
