import { useState, useCallback } from 'react';

type ModalType = 'success' | 'error' | 'warning' | 'info';

interface ModalConfig {
  title: string;
  message: string;
  type: ModalType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useCustomModal() {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const showModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
  }, []);

  const hideModal = useCallback(() => {
    setModalConfig(null);
  }, []);

  const showSuccess = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showModal({
      title,
      message,
      type: 'success',
      confirmText: 'OK',
      onConfirm: () => {
        hideModal();
        onConfirm?.();
      },
    });
  }, [showModal, hideModal]);

  const showError = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showModal({
      title,
      message,
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => {
        hideModal();
        onConfirm?.();
      },
    });
  }, [showModal, hideModal]);

  const showWarning = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showModal({
      title,
      message,
      type: 'warning',
      confirmText: 'OK',
      onConfirm: () => {
        hideModal();
        onConfirm?.();
      },
    });
  }, [showModal, hideModal]);

  const showConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
  ) => {
    showModal({
      title,
      message,
      type: 'warning',
      confirmText,
      cancelText,
      showCancel: true,
      onConfirm: () => {
        hideModal();
        onConfirm();
      },
      onCancel: () => {
        hideModal();
        onCancel?.();
      },
    });
  }, [showModal, hideModal]);

  return {
    modalConfig,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };
}
