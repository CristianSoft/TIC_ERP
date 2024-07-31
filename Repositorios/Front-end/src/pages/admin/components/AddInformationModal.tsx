import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormField } from '../../../components/FormField';
import { infoSchema } from '../../../utils/admin-validations-helper';
import { OrganizationalInfo } from '../../../types/organizational-models';

interface AddInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: OrganizationalInfo) => void;
}

export const AddInformationModal = ({
  isOpen,
  onClose,
  onAddMember,
}: AddInformationModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationalInfo>({
    resolver: yupResolver(infoSchema),
  });

  const onSubmit = async (data: OrganizationalInfo) => {
    onAddMember(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="4">
        <ModalHeader color="brand.blue" textAlign="center">
          Agregar Información de FEPON
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="mission"
            label="Misión"
            placeholder="Ingrese la misión"
            register={register}
            errors={errors.mission}
          />
          <FormField
            id="vision"
            label="Visión"
            placeholder="Ingrese la visión"
            register={register}
            errors={errors.vision}
          />
          <ModalFooter>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
