import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Flex,
  Td,
  IconButton,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { ConfirmationModal } from '../../../../../components/ConfirmationModal';
import { SUBSCRIPTION_PLAN_TABLE_HEADERS } from '../../../../../utils/constants';
import { SubscriptionPlan } from '../../../../../types/subscription-models';
import { subscriptionPlanFilterByName } from '../../../../../utils/filter-helper';
import { isOrganizational } from '../../../../../utils/check-role-helper';
import { useAuth } from '../../../../../contexts/auth-context';
import { useGenericToast } from '../../../../../hooks/general/useGenericToast';

import { TableOptions } from './TableOptions';

interface SubscriptionPlanTableProps {
  plans: SubscriptionPlan[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (id: number | undefined) => void;
  searchPlan: string;
  onSearchPlanChange: (name: string) => void;
  onAddSubscriptionPlan: (plan: SubscriptionPlan) => void;
}

export const SubscriptionPlansTable = ({
  plans,
  error,
  isLoading,
  onEdit,
  onDelete,
  searchPlan,
  onSearchPlanChange,
  onAddSubscriptionPlan,
}: SubscriptionPlanTableProps) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | undefined>();
  const [filteredPlans, setFilteredPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    setFilteredPlans(subscriptionPlanFilterByName(plans, searchPlan));
  }, [plans, searchPlan]);
  const showToast = useGenericToast();

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  }, [error, showToast]);
  const handleDeleteClick = (id: number | undefined) => {
    setSelectedPlanId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlanId !== undefined) {
      onDelete(selectedPlanId);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <Center sx={{ width: 'auto' }}>
        <Spinner size="xl" sx={{ color: 'brand.blue' }} />
      </Center>
    );
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 'md' }}>
      <TableOptions
        plans={plans}
        searchPlan={searchPlan}
        onSearchPlanChange={onSearchPlanChange}
        onAddSubscriptionPlan={onAddSubscriptionPlan}
      />
      <TableContainer>
        <Table
          variant="simple"
          sx={{
            'border': '1px solid',
            'borderColor': 'brand.blue',
            'borderCollapse': 'collapse',
            'width': '100%',
            'textColor': 'surface.default',
            'fontSize': 'text.md',
            '& th, & td': {
              textColor: 'text.default',
              fontSize: 'text.md',
              textAlign: 'center',
            },
            '& th': {
              bg: 'brand.blue',
              textColor: 'white',
              height: '58px',
            },
            '& td': {
              border: '1px solid',
              borderColor: 'brand.blue',
            },
          }}
        >
          <Thead>
            <Tr sx={{ textColor: 'surface.default' }}>
              {isOrganizational(user) ? (
                <Th
                  sx={{
                    borderRight: '1px',
                    width: '20',
                  }}
                ></Th>
              ) : null}
              {SUBSCRIPTION_PLAN_TABLE_HEADERS.map((header, index) => (
                <Th
                  key={index}
                  sx={{
                    borderRight: '1px',
                    borderColor: 'primary.100',
                  }}
                >
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredPlans.length === 0 ? (
              <Tr>
                <Td colSpan={SUBSCRIPTION_PLAN_TABLE_HEADERS.length + 1}>
                  No olvides ingresar planes de aportación.
                </Td>
              </Tr>
            ) : (
              filteredPlans.map((plan) => (
                <Tr key={plan.id}>
                  {isOrganizational(user) ? (
                    <Td>
                      <Flex
                        sx={{
                          gap: 'sm',
                          flexDirection: { sm: 'column', lg: 'row' },
                        }}
                      >
                        <IconButton
                          aria-label="Edit plan"
                          icon={<FaEdit size={16} />}
                          onClick={() => onEdit(plan)}
                          size="sm"
                          sx={{
                            bg: 'none',
                            color: 'brand.blue',
                            _hover: {
                              bg: 'secondary.100',
                              color: 'primary.default',
                            },
                          }}
                        />
                        <IconButton
                          aria-label="Delete plan"
                          icon={<FaTrash size={16} />}
                          onClick={() => handleDeleteClick(plan.id)}
                          size="sm"
                          sx={{
                            bg: 'none',
                            color: 'brand.blue',
                            _hover: {
                              bg: 'secondary.100',
                              color: 'primary.default',
                            },
                          }}
                        />
                      </Flex>
                    </Td>
                  ) : null}
                  <Td>{plan.planName}</Td>
                  <Td>{plan.price}</Td>
                  <Td>{plan.benefits}</Td>
                  <Td>{plan.academicPeriod}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar plan de aportación"
        body="¿Estás seguro de que deseas eliminar este plan de aportantación?"
      />
    </Flex>
  );
};
