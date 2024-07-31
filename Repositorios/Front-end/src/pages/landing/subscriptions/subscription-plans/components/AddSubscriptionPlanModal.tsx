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
import { subscriptionPlanSchema } from '../../../../../utils/subscription-validations-helper';
import { SubscriptionPlan } from '../../../../../types/subscription-models';
import useFetchAcademicPeriods from '../../../../../hooks/general/fetchAcademicPeriodHook';

interface AddSubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubscriptionPlan: (plan: SubscriptionPlan) => void;
}

export const AddSubscriptionPlanrModal = ({
  isOpen,
  onClose,
  onAddSubscriptionPlan: onAddSubscriber,
}: AddSubscriptionPlanModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SubscriptionPlan>({
    resolver: yupResolver(subscriptionPlanSchema),
  });

  const onSubmit = (data: SubscriptionPlan) => {
    onAddSubscriber(data);
    onClose();
  };

  const { academicPeriodsData } = useFetchAcademicPeriods();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Agregar Plan de Aportación
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="planName"
            label="Nombre del plan de aportación"
            placeholder="Ingrese el nombre del plan de aportación"
            register={register}
            errors={errors.planName}
          />
          <FormField
            id="price"
            label="Precio del plan"
            placeholder="Ingreso del precio del plan de aportación"
            register={register}
            errors={errors.price}
          />
          <FormField
            id="benefits"
            label="Beneficios"
            placeholder="Ingrese los beneficios separados por una coma"
            register={register}
            errors={errors.benefits}
          />
          <FormField
            id="academicPeriod"
            label="Periodo académico"
            placeholder="Seleccione el periodo académico"
            register={register}
            errors={errors.academicPeriod}
            options={academicPeriodsData}
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
