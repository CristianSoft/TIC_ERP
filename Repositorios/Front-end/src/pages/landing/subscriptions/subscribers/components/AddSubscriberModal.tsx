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
import { subscriberSchema } from '../../../../../utils/subscription-validations-helper';
import { Subscriber } from '../../../../../types/subscription-models';
import useFetchCareers from '../../../../../hooks/general/FetchCareerHook';
import useFetchFaculties from '../../../../../hooks/general/fetchFacultyHook';
import useFetchContributionPlans from '../../../../../hooks/organizational/fetchContributionPlan';

interface AddSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubscriber: (subscriber: Subscriber) => void;
}

export const AddSubscriberModal = ({
  isOpen,
  onClose,
  onAddSubscriber,
}: AddSubscriberModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Subscriber>({
    resolver: yupResolver(subscriberSchema),
  });

  const onSubmit = (data: Subscriber) => {
    onAddSubscriber(data);
    onClose();
  };

  const { careersData } = useFetchCareers();
  const { facultiesData } = useFetchFaculties();
  const { contributionPlans } = useFetchContributionPlans();

  const contributionPlanNames = contributionPlans.map(
    (contributionPlan) => contributionPlan.planName
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Agregar Aportante
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textColor="text.default">
          <FormField
            id="date"
            label="Fecha"
            type="date"
            disableFutureDates={true}
            placeholder="Seleccione la fecha de la aportación"
            register={register}
            errors={errors.date}
          />
          <FormField
            id="name"
            label="Nombre completo"
            placeholder="Ingrese el nombre del aportante"
            register={register}
            errors={errors.name}
          />
          <FormField
            id="faculty"
            label="Facultad"
            placeholder="Seleccione la facultad"
            register={register}
            errors={errors.faculty}
            options={facultiesData}
          />
          <FormField
            id="career"
            label="Carrera"
            placeholder="Seleccione la carrera"
            register={register}
            errors={errors.career}
            options={careersData}
          />
          <FormField
            id="email"
            label="Correo"
            placeholder="Ingrese el correo electrónico"
            register={register}
            errors={errors.email}
          />
          <FormField
            id="plan"
            label="Plan de aportación"
            placeholder="Seleccione el plan de aportación"
            register={register}
            errors={errors.plan}
            options={contributionPlanNames}
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
