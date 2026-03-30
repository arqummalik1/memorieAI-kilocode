'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  danger = false,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-300 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
