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

import { FormField } from '../../../../../components/FormField';
import { subscriptionPlanSchema } from '../../../../../utils/subscription-validations-helper';
import { SubscriptionPlan } from '../../../../../types/subscription-models';
import useFetchAcademicPeriods from '../../../../../hooks/general/fetchAcademicPeriodHook';

interface EditSubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  onSubmit: (data: { plan: SubscriptionPlan }) => void;
}

export const EditSubscriptionPlanrModal = ({
  isOpen,
  onClose,
  plan,
  onSubmit,
}: EditSubscriptionPlanModalProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionPlan>({
    resolver: yupResolver(subscriptionPlanSchema),
  });

  useEffect(() => {
    if (plan) {
      // Set initial form values when info prop changes
      Object.keys(plan).forEach((key) => {
        setValue(
          key as keyof SubscriptionPlan,
          plan[key as keyof SubscriptionPlan]
        );
      });
    }
  }, [plan, setValue]);

  const { academicPeriodsData } = useFetchAcademicPeriods();
  const handleFormSubmit = (data: SubscriptionPlan) => {
    onSubmit({ plan: data });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Editar Plan de Aportación
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
            <Button type="submit" onClick={handleSubmit(handleFormSubmit)}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
