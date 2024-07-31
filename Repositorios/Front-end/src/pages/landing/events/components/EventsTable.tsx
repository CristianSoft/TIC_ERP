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

import { EVENTS_TABLE_HEADERS } from '../../../../utils/constants';
import { ConfirmationModal } from '../../../../components/ConfirmationModal';
import { EventView } from '../../../../types/event-models';
import { eventsFilterByName } from '../../../../utils/filter-helper';
import { isCulture } from '../../../../utils/check-role-helper';
import { useAuth } from '../../../../contexts/auth-context';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { TableOptions } from './TableOptions';

interface EventTableProps {
  events: EventView[];
  error: Error | null;
  isLoading: boolean;
  onEdit: (event: EventView) => void;
  onDelete: (id: number | undefined) => void;
  searchEvent: string;
  onSearchEventChange: (name: string) => void;
  onAddEvent: (event: EventView) => void;
}

export const EventsTable = ({
  events,
  error,
  isLoading,
  onEdit,
  onDelete,
  searchEvent,
  onSearchEventChange,
  onAddEvent,
}: EventTableProps) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>();
  const [filteredEvents, setFilteredEvents] = useState<EventView[]>([]);
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
    setSelectedEventId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEventId !== undefined) {
      onDelete(selectedEventId);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setFilteredEvents(eventsFilterByName(events, searchEvent));
  }, [events, searchEvent]);

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
        events={events}
        searchEvent={searchEvent}
        onSearchEventChange={onSearchEventChange}
        onAddEvent={onAddEvent}
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
              {EVENTS_TABLE_HEADERS.map((header, index) => (
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
            {filteredEvents.length === 0 ? (
              <Tr>
                <Td colSpan={EVENTS_TABLE_HEADERS.length + 1}>
                  No olvides ingresar eventos.
                </Td>
              </Tr>
            ) : (
              filteredEvents.map((event) => (
                <Tr key={event.id}>
                  {isCulture(user) ? (
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
                          onClick={() => onEdit(event)}
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
                          onClick={() => handleDeleteClick(event.id)}
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
                  <Td>{event.title}</Td>
                  <Td>{event.status}</Td>
                  <Td>{event.description}</Td>
                  <Td>{event.startDate}</Td>
                  <Td>{event.endDate}</Td>
                  <Td>{event.budget}</Td>
                  <Td>{event.budgetStatus}</Td>
                  <Td>{event.location}</Td>
                  <Td>{event.income}</Td>
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
        title="Eliminar evento"
        body="¿Estás seguro de que deseas eliminar este evento?"
      />
    </Flex>
  );
};

export default EventsTable;
