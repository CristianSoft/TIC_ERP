import { useState } from 'react';
import { Heading, Flex, Link, Text } from '@chakra-ui/react';
import { format, formatISO, parseISO } from 'date-fns';

import { Subscriber } from '../../../../types/subscription-models';
import  useFetchContributors  from '../../../../hooks/organizational/fetchContributorHook';
import useUpdateContributor, {
  CreateUpdateContributorDTO,
} from '../../../../hooks/organizational/updateContributor';
import usePatchContributorState from '../../../../hooks/organizational/patchContributorHook';
import usePostContributor from '../../../../hooks/organizational/createContributorHook';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { EditSubscriberModal } from './components/EditSubscriberModal';
import { SubscribersTable } from './components/SubscribersTable';

export const SubscribersPage = () => {
  const [isEditSubscriberModalOpen, setEditSubscriberModalOpen] =
    useState(false);
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<Subscriber | null>(null);
  const [searchSubscriber, setSearchSubscriber] = useState('');

  const {
    contributors,
    isLoadingContributors,
    contributorErrors,
    updateContributorState,
    addContributionPlanState,
  } = useFetchContributors();

  const { updateContributor } = useUpdateContributor();
  const { patchContributorState } = usePatchContributorState();
  const { postContributor } = usePostContributor();

  const showToast = useGenericToast();

  const handleEditMovement = async (data: { subscriber: Subscriber }) => {
    try {
      const formattedDate = formatISO(new Date(data.subscriber.date));
      const updatedInfo: CreateUpdateContributorDTO = {
        date: formattedDate,
        name: data.subscriber.name,
        faculty: data.subscriber.faculty,
        career: data.subscriber.career,
        email: data.subscriber.email,
        plan: data.subscriber.plan,
      };

      const updatedSubscriber = await updateContributor(data.subscriber.id!, updatedInfo);

      const originalFormattedDate = format(
        parseISO(data.subscriber.date),
        'dd/MM/yyyy'
      );

      updateContributorState(data.subscriber.id!, {
        ...data.subscriber,
        ...updatedInfo,
        date: originalFormattedDate,
        price: updatedSubscriber.price,
        academicPeriod: updatedSubscriber.academicPeriod,
      });

      showToast({
        title: 'Actualización exitosa',
        description: 'Información del aportante actualizada correctamente.',
        status: 'success',
      });

      console.log('Updated organizational information:', data.subscriber);
    } catch (error) {
      console.error('Failed to update association:', error);
      showToast({
        title: 'Error',
        description: 'Hubo un problema al actualizar el aportante.',
        status: 'error',
      });
    }
  };

  const handleDeleteMovement = async (id: number | undefined) => {
    try {
      await patchContributorState(id!);
      updateContributorState(id!, { state_id: 2 });

      showToast({
        title: 'Eliminación exitosa',
        description: `Aportante eliminado correctamente.`,
        status: 'success',
      });

      console.log('Aportante eliminado:', id);
    } catch (error) {
      console.error('Failed to update association state:', error);
      showToast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el aportante.',
        status: 'error',
      });
    }
  };

  const openEditMovementModal = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setEditSubscriberModalOpen(true);
  };

  const handleSearchSubscriberChange = (name: string) => {
    setSearchSubscriber(name);
  };

  const handleAddSubscriber = async (newSubscriber: Subscriber) => {
    try {
      const newContributor: CreateUpdateContributorDTO = {
        date: formatISO(new Date(newSubscriber.date)),
        name: newSubscriber.name,
        faculty: newSubscriber.faculty,
        career: newSubscriber.career,
        email: newSubscriber.email,
        plan: newSubscriber.plan,
      };

      const createdSubscriber = await postContributor(newContributor);

      console.log('Created subscribeeeeer despues del post:', createdSubscriber);

      addContributionPlanState(createdSubscriber);

      showToast({
        title: 'Creación exitosa',
        description: 'Aportante creado correctamente.',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to create subscriber:', error);

      showToast({
        title: 'Error',
        description: 'Hubo un problema al crear el aportante.',
        status: 'error',
      });
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Aportantes</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Antes de añadir un aportante, asegúrate de que los planes de suscripción
        ya se encuentren registrados. En caso de no estar seguro revisa los
        <Link
          href="/aportaciones/planes-aportacion"
          sx={{ color: 'brand.blue', ml: '3xs' }}
        >
          planes de aportación disponibles.
        </Link>
      </Text>
      <SubscribersTable
        subscribers={contributors}
        onEdit={openEditMovementModal}
        onDelete={handleDeleteMovement}
        error={contributorErrors}
        isLoading={isLoadingContributors}
        searchSubscriber={searchSubscriber}
        onSearchSubscriberChange={handleSearchSubscriberChange}
        onAddSubscriber={handleAddSubscriber}
      />

      <EditSubscriberModal
        isOpen={isEditSubscriberModalOpen}
        onClose={() => setEditSubscriberModalOpen(false)}
        subscriber={selectedSubscriber}
        onSubmit={handleEditMovement}
      />
    </Flex>
  );
};
