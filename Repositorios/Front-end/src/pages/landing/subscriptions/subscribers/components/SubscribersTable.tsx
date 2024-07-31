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
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { ConfirmationModal } from '../../../../../components/ConfirmationModal';
import { SUBSCRIBER_TABLE_HEADERS } from '../../../../../utils/constants';
import { Subscriber } from '../../../../../types/subscription-models';
import { subscribersFilterByName } from '../../../../../utils/filter-helper';
import { isOrganizational } from '../../../../../utils/check-role-helper';
import { useAuth } from '../../../../../contexts/auth-context';
import { useGenericToast } from '../../../../../hooks/general/useGenericToast';

import { TableOptions } from './TableOptions';

interface SubscribersTableProps {
  subscribers: Subscriber[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (subscriber: Subscriber) => void;
  onDelete: (id: number | undefined) => void;
  searchSubscriber: string;
  onSearchSubscriberChange: (name: string) => void;
  onAddSubscriber: (subscriber: Subscriber) => void;
}

export const SubscribersTable = ({
  subscribers,
  error,
  isLoading,
  onEdit,
  onDelete,
  searchSubscriber,
  onSearchSubscriberChange,
  onAddSubscriber,
}: SubscribersTableProps) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<
    number | undefined
  >();
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    []
  );
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

  useEffect(() => {
    setFilteredSubscribers(
      subscribersFilterByName(subscribers, searchSubscriber)
    );
  }, [subscribers, searchSubscriber]);

  const handleDeleteClick = (id: number | undefined) => {
    setSelectedSubscriberId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSubscriberId !== undefined) {
      onDelete(selectedSubscriberId);
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
        subscribers={subscribers}
        searchSubscriber={searchSubscriber}
        onSearchSubscriberChange={onSearchSubscriberChange}
        onAddSubscriber={onAddSubscriber}
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
              {SUBSCRIBER_TABLE_HEADERS.map((header, index) => (
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
            {filteredSubscribers.length === 0 ? (
              <Tr>
                <Td colSpan={SUBSCRIBER_TABLE_HEADERS.length + 1}>
                  No olvides ingresar aportantes.
                </Td>
              </Tr>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <Tr key={subscriber.id}>
                  {isOrganizational(user) ? (
                    <Td>
                      <Flex
                        sx={{
                          gap: 'sm',
                          flexDirection: { sm: 'column', lg: 'row' },
                        }}
                      >
                        <IconButton
                          aria-label="Edit Event"
                          icon={<FaEdit size={16} />}
                          onClick={() => onEdit(subscriber)}
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
                          aria-label="Delete Event"
                          icon={<FaTrash size={16} />}
                          onClick={() => handleDeleteClick(subscriber.id)}
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
                  <Td>{subscriber.date}</Td>
                  <Td>{subscriber.name}</Td>
                  <Td>{subscriber.faculty}</Td>
                  <Td>{subscriber.career}</Td>
                  <Td>{subscriber.email}</Td>
                  <Td>{subscriber.plan}</Td>
                  <Td>{subscriber.price}</Td>
                  <Td>{subscriber.academicPeriod}</Td>
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
        title="Eliminar aportante"
        body="¿Estás seguro de que deseas eliminar este aportante?"
      />
    </Flex>
  );
};
