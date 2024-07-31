import React, { useEffect } from 'react';
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

interface EditInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: OrganizationalInfo | null;
  onSubmit: (data: { info: OrganizationalInfo }) => void;
}

export const EditInformationModal = ({
  isOpen,
  onClose,
  info,
  onSubmit,
}: EditInformationModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrganizationalInfo>({
    resolver: yupResolver(infoSchema),
  });

  useEffect(() => {
    if (info) {
      // Set initial form values when info prop changes
      Object.keys(info).forEach((key) => {
        setValue(
          key as keyof OrganizationalInfo,
          info[key as keyof OrganizationalInfo]
        );
      });
    }
  }, [info, setValue]);

  const handleFormSubmit = (data: OrganizationalInfo) => {
    onSubmit({ info: data });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="4">
        <ModalHeader color="brand.blue" textAlign="center">
          Editar Información de FEPON
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
            <Button onClick={handleSubmit(handleFormSubmit)} type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
