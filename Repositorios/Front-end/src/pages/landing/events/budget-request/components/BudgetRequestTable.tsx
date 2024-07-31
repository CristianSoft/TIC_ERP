import { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Flex,
  Spinner,
  Td,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { ConfirmationModal } from '../../../../../components/ConfirmationModal';
import { BudgetRequest } from '../../../../../types/event-models';
import { budgetRequestFilterByEventName } from '../../../../../utils/filter-helper';
import { BUDGET_REQUEST_TABLE_HEADERS } from '../../../../../utils/constants';
import { useAuth } from '../../../../../contexts/auth-context';
import { isCulture } from '../../../../../utils/check-role-helper';
import { useGenericToast } from '../../../../../hooks/general/useGenericToast';

import { TableOptions } from './TableOptions';

interface BudgetRequestTableProps {
  budgetRequests: BudgetRequest[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (request: BudgetRequest) => void;
  onDelete: (id: number | undefined) => void;
  searchRequest: string;
  onSearchRequestChange: (name: string) => void;
  onAddBudgetRequest: (request: BudgetRequest) => void;
}

export const BudgetRequestTable = ({
  budgetRequests,
  error,
  isLoading,
  onEdit,
  onDelete,
  searchRequest,
  onSearchRequestChange,
  onAddBudgetRequest,
}: BudgetRequestTableProps) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudgetRequestId, setSelectedBudgetRequestId] = useState<
    number | undefined
  >();
  const [filteredRequests, setFilteredRequests] = useState<BudgetRequest[]>([]);
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
    setSelectedBudgetRequestId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBudgetRequestId !== undefined) {
      onDelete(selectedBudgetRequestId);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setFilteredRequests(
      budgetRequestFilterByEventName(budgetRequests, searchRequest)
    );
  }, [budgetRequests, searchRequest]);

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
        requests={budgetRequests}
        searchBudgetRequest={searchRequest}
        onSearchBudgetRequestChange={onSearchRequestChange}
        onAddBudgetRequest={onAddBudgetRequest}
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
              {isCulture(user) ? (
                <Th
                  sx={{
                    borderRight: '1px',
                    width: '20',
                  }}
                ></Th>
              ) : null}
              {BUDGET_REQUEST_TABLE_HEADERS.map((header, index) => (
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
            {filteredRequests.length === 0 ? (
              <Tr>
                <Td colSpan={BUDGET_REQUEST_TABLE_HEADERS.length + 1}>
                  No olvides ingresar eventos.
                </Td>
              </Tr>
            ) : (
              filteredRequests.map((budgetRequest) => (
                <Tr key={budgetRequest.id}>
                  {isCulture(user) ? (
                    <Td>
                      <Flex
                        sx={{
                          gap: 'sm',
                          flexDirection: { sm: 'column', lg: 'row' },
                        }}
                      >
                        <IconButton
                          aria-label="Edit Budget Request"
                          icon={<FaEdit size={16} />}
                          onClick={() => onEdit(budgetRequest)}
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
                        {/*<IconButton
                          aria-label="Delete Budget Request"
                          icon={<FaTrash size={16} />}
                          onClick={() => handleDeleteClick(budgetRequest.id)}
                          size="sm"
                          sx={{
                            bg: 'none',
                            color: 'brand.blue',
                            _hover: {
                              bg: 'secondary.100',
                              color: 'primary.default',
                            },
                          }}
                        />*/}
                      </Flex>
                    </Td>
                  ) : null}
                  <Td>{budgetRequest.eventName}</Td>
                  <Td>{budgetRequest.requestStatusName}</Td>
                  <Td>{budgetRequest.reason}</Td>
                  <Td>{budgetRequest.value}</Td>
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
        title="Eliminar solicitud de presupuesto"
        body="¿Estás seguro de que deseas eliminar esta solicitud de presupuesto?"
      />
    </Flex>
  );
};
