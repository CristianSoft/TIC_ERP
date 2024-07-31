import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface EventStateDTO {
  eventState_Name: string;
}

export const useFetchEventStates = () => {
  const [eventStatesData, setEventStatesData] = useState<string[]>([]);
  const [eventStatesLoading, setEventStatesLoading] = useState(true);
  const [eventStatesError, setEventStatesError] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_EVENT_STATES_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: EventStateDTO[] = await response.json();
        setEventStatesData(data.map((state) => state.eventState_Name));
        console.log(data); // Impresión de los datos
      } catch (error) {
        if (error instanceof Error) {
          setEventStatesError(error);
        } else {
          setEventStatesError(new Error('An unknown error occurred'));
        }
      } finally {
        setEventStatesLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { eventStatesData, eventStatesLoading, eventStatesError };
};

export default useFetchEventStates;
