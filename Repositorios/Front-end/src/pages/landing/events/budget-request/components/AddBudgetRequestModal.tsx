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
import { budgetRequestSchema } from '../../../../../utils/event-validations-helper';
import { BudgetRequest } from '../../../../../types/event-models';

interface AddBudgetRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBudgetRequest: (request: BudgetRequest) => void;
}

export const AddBudgetRequestModal = ({
  isOpen,
  onClose,
  onAddBudgetRequest,
}: AddBudgetRequestModalProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<BudgetRequest>({
    resolver: yupResolver(budgetRequestSchema),
    defaultValues: {
      requestStatusName: 'EN REVISION',
    },
  });

  const onSubmit = (data: BudgetRequest) => {
    onAddBudgetRequest(data);
    onClose();
  };

  useEffect(() => {
    setValue('requestStatusName', 'EN REVISION');
  }, [setValue]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Agregar Solicitud de Presupuesto
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="eventName"
            label="Evento"
            placeholder="Selecciona el evento"
            register={register}
            errors={errors.eventName}
            options={['Evento 1', 'Evento 2', 'Evento 3']}
          />
          <FormField
            id="requestStatusName"
            label="Estado de la solicitud"
            placeholder="Seleccione estado de la solicitud de presupuesto"
            register={register}
            errors={errors.requestStatusName}
            options={['EN REVISION', 'APROBADO', 'RECHAZADO']}
            defaultValue="EN REVISION"
          />
          <FormField
            id="reason"
            label="Motivo"
            placeholder="Ingrese el motivo de la solicitud"
            register={register}
            errors={errors.reason}
          />
          <FormField
            id="value"
            label="Valor"
            placeholder="Ingrese el valor por el que realiza la solicitud"
            register={register}
            errors={errors.value}
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
