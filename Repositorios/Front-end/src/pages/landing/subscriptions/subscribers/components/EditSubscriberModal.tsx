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
import { subscriberSchema } from '../../../../../utils/subscription-validations-helper';
import { Subscriber } from '../../../../../types/subscription-models';
import useFetchFaculties from '../../../../../hooks/general/fetchFacultyHook';
import useFetchCareers from '../../../../../hooks/general/FetchCareerHook';
import useFetchContributionPlans from '../../../../../hooks/organizational/fetchContributionPlan';
import { parse } from 'date-fns/parse';
import { format } from 'date-fns';

interface EditSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: Subscriber | null;
  onSubmit: (data: { subscriber: Subscriber }) => void;
}

export const EditSubscriberModal = ({
  isOpen,
  onClose,
  subscriber,
  onSubmit,
}: EditSubscriberModalProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Subscriber>({
    resolver: yupResolver(subscriberSchema),
  });

  useEffect(() => {
    if (subscriber) {
      Object.keys(subscriber).forEach((key) => {
        setValue(key as keyof Subscriber, subscriber[key as keyof Subscriber]);
      });
    }

    // Handle automated date
    if (subscriber?.date) {
      const dateValue = parse(subscriber.date, 'dd/MM/yyyy', new Date());
      if (!isNaN(dateValue.getTime())) {
        setValue('date', format(dateValue, 'yyyy-MM-dd'));
      }
    }
  }, [subscriber, setValue]);

  const handleFormSubmit = (data: Subscriber) => {
    onSubmit({ subscriber: data });
    onClose();
  };
  const { facultiesData } = useFetchFaculties();
  const { careersData } = useFetchCareers();
  const { contributionPlans } = useFetchContributionPlans();
  const planNames = contributionPlans.map((plan) => plan.planName);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ p: 'sm' }}>
        <ModalHeader color="brand.blue" textAlign="center">
          Editar Aportante
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
            options={planNames}
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
