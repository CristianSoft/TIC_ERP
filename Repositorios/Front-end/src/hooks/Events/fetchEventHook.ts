import { useEffect, useState } from 'react';

import { CreateUpdateEventDTO } from './updateEventhook';
import { DEFAULT_STATE } from '../../utils/constants';
import { useAuth } from '../../contexts/auth-context';

export interface EventView {
  id?: number;
  stateid?: number;
  title: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetStatus: string;
  location: string;
  income?: number;
}

export const useFetchEvents = () => {
  const [events, setEvents] = useState<EventView[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventErrors, setEventErrors] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_EVENTS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json(); // Read the response body
          throw new Error(
            `Error: ${response.status} ${response.statusText} - ${errorData.message}`
          );
        }

        const data: EventView[] = await response.json();
        setEvents(data);
        console.log('Fetched events:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setEventErrors(error);
        } else {
          setEventErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [endpoint]);

  const updateEventState = (id: number, updatedData: Partial<EventView>) => {
    setEvents((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated events:', newData);
      return newData;
    });
  };

  const addEventState = (newEvent: CreateUpdateEventDTO) => {
    setEvents((prevData) => {
      const newData = [...prevData, newEvent];
      console.log('Added new member:', newData, 'dsdsdsd');
      return newData;
    });
  };

  const filteredEvents = events.filter(
    (item) => item.stateid === DEFAULT_STATE // Adjust the filter condition as needed
  );

  return {
    events: filteredEvents,
    isLoadingEvents,
    eventErrors,
    updateEventState,
    addEventState,
  };
};

export default useFetchEvents;
