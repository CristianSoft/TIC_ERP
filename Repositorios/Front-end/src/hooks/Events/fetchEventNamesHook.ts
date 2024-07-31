import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface EventDTO {
  id: number;
  title: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetStatus: string;
  location: string;
  income: string;
}

export const useFetchEventNames = () => {
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_EVENTS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchEventNames = async () => {
      try {
        const response = await fetch(endpoint,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: EventDTO[] = await response.json();
        setEventNames(data.map((event) => event.title));
        console.log(
          'Fetched event names:',
          data.map((event) => event.title)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventNames();
  }, [endpoint]);

  return { eventNames, isLoading, error };
};

export default useFetchEventNames;
