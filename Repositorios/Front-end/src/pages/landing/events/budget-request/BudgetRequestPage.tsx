import { Heading, Flex, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { BudgetRequest } from '../../../../types/event-models';
import useFetchFinantialRequests from '../../../../hooks/Events/fetchFinantialRequestHook';
import useUpdateFinantialRequest, {
  CreateUpdateFinantialRequestDTO,
} from '../../../../hooks/Events/updateFinancialRequestHook';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { EditBudgetRequestModal } from './components/EditBudgetRequestModal';
import { BudgetRequestTable } from './components/BudgetRequestTable';

export const BudgetRequestPage = () => {
  const [isEditBudgetRequestModalOpen, setEditBudgetRequestModalOpen] =
    useState(false);
  const [selectedBudgetRequest, setSelectedBudgetRequest] =
    useState<BudgetRequest | null>(null);
  const [searchBudgetRequest, setSearchBudgetRequest] = useState('');

  const {
    finantialRequests,
    isLoadingFinantialRequests,
    finantialRequestErrors,
    updateFinantialRequestState,
  } = useFetchFinantialRequests();
  const { updateFinantialRequest } = useUpdateFinantialRequest();
  const showToast = useGenericToast();

  const handleEditBudgetRequest = async (data: { request: BudgetRequest }) => {
    try {
      const updatedInfo: CreateUpdateFinantialRequestDTO = {
        eventName: data.request.eventName,
        reason: data.request.reason,
        requestStatusName: data.request.requestStatusName,
        value: data.request.value,
      };

      await updateFinantialRequest(data.request.id!, updatedInfo);

      updateFinantialRequestState(data.request.id!, {
        ...data.request,
        ...updatedInfo,
      });

      console.log('Updated event information:', data.request);
      showToast({
        title: 'Actualización exitosa',
        description: 'Solicitud de presupuesto actualizada.',
        status: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        showToast({
          title: 'Error al actualizar la solicitud de presupuesto',
          description: error.message,
          status: 'error',
        });
      }
    }
  };

  const handleDeleteBudgetRequest = (id: number | undefined) => {
    //events.filter((event) => event.id !== id);
    console.log('Solicitud eliminada:', id);
  };

  const openEditBudgetRequestModal = (request: BudgetRequest) => {
    setSelectedBudgetRequest(request);
    setEditBudgetRequestModalOpen(true);
  };

  const handleSearchBudgetRequestChange = (name: string) => {
    setSearchBudgetRequest(name);
  };

  const handleAddBudgetRequest = async (newRequest: BudgetRequest) => {
    console.log('Añadir solicitud: ', newRequest);
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Solicitud de Presupuesto</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Antes de añadir una solicitud de presupesto, asegúrate de que los
        eventos ya se encuentren registrados. En caso de no estar seguro revisa
        los
        <Link
          href="/eventos"
          sx={{ color: 'brand.blue', ml: '3xs' }}
        >
          eventos disponibles.
        </Link>
      </Text>
      <BudgetRequestTable
        budgetRequests={finantialRequests}
        onEdit={openEditBudgetRequestModal}
        onDelete={handleDeleteBudgetRequest}
        error={finantialRequestErrors}
        isLoading={isLoadingFinantialRequests}
        searchRequest={searchBudgetRequest}
        onSearchRequestChange={handleSearchBudgetRequestChange}
        onAddBudgetRequest={handleAddBudgetRequest}
      />

      <EditBudgetRequestModal
        isOpen={isEditBudgetRequestModalOpen}
        onClose={() => setEditBudgetRequestModalOpen(false)}
        budget={selectedBudgetRequest}
        onSubmit={handleEditBudgetRequest}
      />
    </Flex>
  );
};
