import { useEffect } from 'react';
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
import { transactionSchema } from '../../../../../utils/finantial-validations-helper';
import { Transaction } from '../../../../../types/finantial-models';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSubmit: (data: { transaction: Transaction }) => void;
}

export const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onSubmit,
}: EditTransactionModalProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Transaction>({
    resolver: yupResolver(transactionSchema),
  });

  useEffect(() => {
    if (transaction) {
      // Set initial form values when info prop changes
      Object.keys(transaction).forEach((key) => {
        setValue(
          key as keyof Transaction,
          transaction[key as keyof Transaction]
        );
      });
    }
  }, [transaction, setValue]);

  const handleFormSubmit = (data: Transaction) => {
    onSubmit({ transaction: data });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Editar Transacción
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="date"
            label="Fecha de transacción"
            type="date"
            disableFutureDates={true}
            placeholder="Seleccione la fecha de transacción"
            register={register}
            errors={errors.date}
          />
          <FormField
            id="originAccount"
            label="Cuenta de origen"
            placeholder="Seleccione la cuenta de origen"
            register={register}
            errors={errors.originAccount}
            options={['Cuenta 1', 'Cuenta 2', 'Cuenta 3']}
          />
          <FormField
            id="destinationAccount"
            label="Cuenta de destino"
            placeholder="Seleccione la cuenta de destino"
            register={register}
            errors={errors.destinationAccount}
            options={['Cuenta 1', 'Cuenta 2', 'Cuenta 3']}
          />
          <FormField
            id="value"
            label="Valor de la transacción"
            placeholder="Ingrese el valor de la transacción"
            register={register}
            errors={errors.value}
          />
          <FormField
            id="transactionType"
            label="Tipo de transacción"
            placeholder="Seleccione el tipo de transacción"
            register={register}
            errors={errors.transactionType}
            options={['INGRESO', 'EGRESO']}
          />
          <FormField
            id="description"
            label="Descripción"
            placeholder="Ingrese la descripción del evento"
            register={register}
            errors={errors.description}
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
