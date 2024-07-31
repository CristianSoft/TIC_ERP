import { Heading, Flex, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { format, formatISO, parseISO } from 'date-fns';

import { EventView } from '../../../types/event-models';
import useFetchEvents from '../../../hooks/Events/fetchEventHook';
import useUpdateEvent, {
  CreateUpdateEventDTO,
} from '../../../hooks/Events/updateEventhook';
import usePostEventWithFinancialRequest from '../../../hooks/Events/createEventHook';
import usePatchEventState from '../../../hooks/Events/patchEventoHook';
import { useGenericToast } from '../../../hooks/general/useGenericToast';

import { EditEventModal } from './components/EditEventModal';
import { EventsTable } from './components/EventsTable';

export const EventsPage = () => {
  const [isEditEventModalOpen, setEditEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventView | null>(null);
  const [searchEvent, setSearchEvent] = useState('');
  const { postEvent } = usePostEventWithFinancialRequest();
  const {
    events,
    isLoadingEvents,
    eventErrors,
    updateEventState,
    addEventState,
  } = useFetchEvents();
  const { updateEvent } = useUpdateEvent();
  const { patchEventState } = usePatchEventState();
  const showToast = useGenericToast();

  const handleEditEvent = async (data: { event: EventView }) => {
    try {
      const formattedDate = formatISO(new Date(data.event.startDate));
      const formattedDate2 = formatISO(new Date(data.event.endDate));
      const updatedInfo: CreateUpdateEventDTO = {
        title: data.event.title,
        status: data.event.status,
        description: data.event.description,
        startDate: formattedDate,
        endDate: formattedDate2,
        budget: data.event.budget,
        budgetStatus: data.event.budgetStatus,
        location: data.event.location,
        income: data.event.income,
      };
      const originalFormattedEndDate = format(
        parseISO(data.event.endDate),
        'dd/MM/yyyy'
      );
      const originalFormattedStartDate = format(
        parseISO(data.event.startDate),
        'dd/MM/yyyy'
      );
      await updateEvent(data.event.id!, updatedInfo);

      updateEventState(data.event.id!, {
        ...data.event,
        ...updatedInfo,
        startDate: originalFormattedStartDate,
        endDate: originalFormattedEndDate,
      });

      showToast({
        title: 'Actualización exitosa',
        description: 'Evento actualizado con éxito.',
        status: 'success',
      });
    } catch (error) {
      if (error instanceof Error)
        showToast({
          title: 'Error al actualizar el evento',
          description: error.message,
          status: 'error',
        });
    }
  };

  const handleDeleteEvent = async (id: number | undefined) => {
    try {
      await patchEventState(id!);
      updateEventState(id!, { stateid: 2 });
      showToast({
        title: 'Eliminación exitosa',
        description: `Evento eliminado correctamente.`,
        status: 'success',
      });
    } catch (error) {
      if (error instanceof Error)
        showToast({
          title: 'Error al eliminar el evento',
          description: error.message,
          status: 'error',
        });
    }
  };

  const openEditEventModal = (event: EventView) => {
    setSelectedEvent(event);
    setEditEventModalOpen(true);
  };

  const handleSearchEventChange = (name: string) => {
    setSearchEvent(name);
  };

  const handleAddEvent = async (newEvent: EventView) => {
    try {
      const formattedDate = formatISO(new Date(newEvent.startDate));
      const formattedDate2 = formatISO(new Date(newEvent.endDate));
      const updatedInfo: CreateUpdateEventDTO = {
        title: newEvent.title,
        status: newEvent.status,
        description: newEvent.description,
        startDate: formattedDate,
        endDate: formattedDate2,
        budget: newEvent.budget,
        budgetStatus: newEvent.budgetStatus,
        location: newEvent.location,
        income: newEvent.income,
      };

      const newAdminMember = await postEvent(updatedInfo);

      addEventState(newAdminMember);
      showToast({
        title: 'Registro exitoso',
        description: 'El evento se registró correctamente.',
        status: 'success',
      });
    } catch (error) {
      if (error instanceof Error)
        showToast({
          title: 'Error al añadir el evento',
          description: error.message,
          status: 'error',
        });
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Eventos</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Ahora que añadiste los eventos necesarios, ya puedes
        <Link
          href="/eventos/solicitud-presupuesto"
          sx={{ color: 'brand.blue', mx: '3xs' }}
        >
          solicitar tu presupuesto.
        </Link>
      </Text>
      <EventsTable
        events={events}
        onEdit={openEditEventModal}
        onDelete={handleDeleteEvent}
        error={eventErrors}
        isLoading={isLoadingEvents}
        searchEvent={searchEvent}
        onSearchEventChange={handleSearchEventChange}
        onAddEvent={handleAddEvent}
      />

      <EditEventModal
        isOpen={isEditEventModalOpen}
        onClose={() => setEditEventModalOpen(false)}
        event={selectedEvent}
        onSubmit={handleEditEvent}
      />
    </Flex>
  );
};
