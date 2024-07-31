import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import { useEffect } from 'react';

import { FormField } from '../../../../components/FormField';
import { suppliersSchema } from '../../../../utils/supplier-validations-helper';
import { Supplier } from '../../../../types/supplier-models';

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onSubmit: (data: { supplier: Supplier }) => void;
}

export const EditSupplierModal = ({
  isOpen,
  onClose,
  supplier,
  onSubmit,
}: EditSupplierModalProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Supplier>({
    resolver: yupResolver(suppliersSchema),
  });

  useEffect(() => {
    if (supplier) {
      // Set initial form values when info prop changes
      Object.keys(supplier).forEach((key) => {
        setValue(key as keyof Supplier, supplier[key as keyof Supplier]);
      });
    }
  }, [supplier, setValue]);

  const handleFormSubmit = (data: Supplier) => {
    onSubmit({ supplier: data });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Editar Proveedor
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="name"
            label="Nombre completo"
            placeholder="Ingrese el nombre del proveedor"
            register={register}
            errors={errors.name}
          />
          <FormField
            id="phone"
            label="Número telefónico"
            placeholder="Ingrese número telefónico"
            register={register}
            errors={errors.phone}
          />
          <FormField
            id="email"
            label="Correo"
            placeholder="Ingrese el correo electrónico"
            register={register}
            errors={errors.email}
          />
          <ModalFooter>
            <Button type="submit" onClick={handleSubmit(handleFormSubmit)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
