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

import { FormField } from '../../../../../components/FormField';
import { accountSchema } from '../../../../../utils/finantial-validations-helper';
import { Account } from '../../../../../types/finantial-models';
import useFetchAccountTypes from '../../../../../hooks/financial/fetchAccountTypeHook';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Account) => void;
}

export const AddAccountModal = ({
  isOpen,
  onClose,
  onAddAccount,
}: AddAccountModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Account>({
    resolver: yupResolver(accountSchema),
  });

  const onSubmit = (data: Account) => {
    console.log('Cuenta agregada:', data);
    onAddAccount(data);
    onClose();
  };

  const { accountTypesData } = useFetchAccountTypes();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Agregar Cuenta Contable
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="accountType"
            label="Tipo de cuenta"
            placeholder="Seleccione el tipo de cuenta contable"
            register={register}
            errors={errors.accountType}
            options={accountTypesData}
          />
          <FormField
            id="accountName"
            label="Cuenta"
            placeholder="Ingrese el nombre de la cuenta contable"
            register={register}
            errors={errors.accountName}
          />
          <FormField
            id="currentValue"
            label="Valor actual"
            placeholder="Ingrese el valor actual de la cuenta"
            register={register}
            errors={errors.currentValue}
          />
          <FormField
            id="date"
            label="Fecha de creación de cuenta"
            type="date"
            disableFutureDates={true}
            placeholder="Seleccione la fecha de la creación de la cuenta"
            register={register}
            errors={errors.date}
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
