import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody sx={{ textColor: 'text.default', textAlign: 'justify' }}>
          {body}
        </ModalBody>
        <ModalFooter
          sx={{ display: 'flex', gap: 'xs', justifyContent: 'center' }}
        >
          <Button onClick={onClose} variant="cancel">
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Eliminar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
