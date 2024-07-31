import { Heading, Flex, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { SubscriptionPlan } from '../../../../types/subscription-models';
import useFetchContributionPlans from '../../../../hooks/organizational/fetchContributionPlan';
import useUpdateContributionPlan, {
  CreateUpdateContributionPlanDTO,
} from '../../../../hooks/organizational/updateContributorPlan';
import usePatchContributionPlanState from '../../../../hooks/organizational/patchContributionPlanHook';
import usePostContributionPlan from '../../../../hooks/organizational/createContributionPlan';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { EditSubscriptionPlanrModal } from './components/EditSubscriptionPlanModal';
import { SubscriptionPlansTable } from './components/SubscribtionPlansTable';

export const SubscriptionPlansPage = () => {
  const [isEditPlanModalOpen, setEditPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [searchPlan, setSearchPlan] = useState('');

  const { postContributionPlan } = usePostContributionPlan();
  const {
    contributionPlans,
    isLoadingContributionPlans,
    contributionPlanErrors,
    updateContributionPlanState,
    addContributionPlanState,
  } = useFetchContributionPlans();
  const { updateContributionPlan } = useUpdateContributionPlan();
  const { patchContributionPlanState } = usePatchContributionPlanState();

  const showToast = useGenericToast();

  const handleEditTransaction = async (data: { plan: SubscriptionPlan }) => {
    try {
      const updatedInfo: CreateUpdateContributionPlanDTO = {
        planName: data.plan.planName,
        price: data.plan.price,
        benefits: data.plan.benefits,
        academic_Period_Name: data.plan.academicPeriod,
      };

      await updateContributionPlan(data.plan.id!, updatedInfo);

      // Update local state with updated plan
      updateContributionPlanState(data.plan.id!, {
        ...data.plan,
        ...updatedInfo,
      });

      showToast({
        title: 'Actualización exitosa',
        description: 'Plan de aportación actualizado correctamente.',
        status: 'success',
      });

      console.log('Updated contribution plan information:', data.plan);
    } catch (error) {
      console.error('Failed to update contribution plan:', error);

      showToast({
        title: 'Error',
        description: 'Hubo un problema al actualizar el plan de aportación.',
        status: 'error',
      });
    }
  };

  const handleDeleteTransaction = async (id: number | undefined) => {
    try {
      await patchContributionPlanState(id!);
      updateContributionPlanState(id!, { state_id: 2 });

      showToast({
        title: 'Eliminación exitosa',
        description: `Plan de aportación eliminado correctamente.`,
        status: 'success',
      });

      console.log('Plan de aportacion eliminado:', id);
    } catch (error) {
      console.error(
        'Falla al actualizar el estado del plan de aportacion:',
        error
      );

      showToast({
        title: 'Error',
        description: 'Hubo un problema al eliminar el plan de aportación.',
        status: 'error',
      });
    }
  };

  const openEditTransactionModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setEditPlanModalOpen(true);
  };

  const handleSearchEventChange = (name: string) => {
    setSearchPlan(name);
  };

  const handleAddPlan = async (newPlan: SubscriptionPlan) => {
    try {
      const newContributionPlan: CreateUpdateContributionPlanDTO = {
        planName: newPlan.planName,
        price: newPlan.price,
        benefits: newPlan.benefits,
        academic_Period_Name: newPlan.academicPeriod,
      };

      const createdPlan = await postContributionPlan(newContributionPlan);

      addContributionPlanState(createdPlan);

      showToast({
        title: 'Creación exitosa',
        description: 'Plan de aportación creado correctamente.',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to create subscriber plan:', error);

      showToast({
        title: 'Error',
        description: 'Hubo un problema al crear el plan de aportación.',
        status: 'error',
      });
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Planes de Aportación</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Una vez que añadiste los planes de aportación necesarios, ya puedes
        <Link
          href="/aportaciones/aportantes"
          sx={{ color: 'brand.blue', ml: '3xs' }}
        >
          registrar a tus aportantes.
        </Link>
      </Text>
      <SubscriptionPlansTable
        plans={contributionPlans}
        onEdit={openEditTransactionModal}
        onDelete={handleDeleteTransaction}
        error={contributionPlanErrors}
        isLoading={isLoadingContributionPlans}
        searchPlan={searchPlan}
        onSearchPlanChange={handleSearchEventChange}
        onAddSubscriptionPlan={handleAddPlan}
      />

      <EditSubscriptionPlanrModal
        isOpen={isEditPlanModalOpen}
        onClose={() => setEditPlanModalOpen(false)}
        plan={selectedPlan}
        onSubmit={handleEditTransaction}
      />
    </Flex>
  );
};
