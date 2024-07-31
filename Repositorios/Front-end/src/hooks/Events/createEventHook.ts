import { useState } from 'react';

import { EventView } from '../../types/event-models';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateEventDTO {
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

const usePostEventWithFinancialRequest = () => {
  const [postEventError, setPostError] = useState<string | null>(null);
  const { token } = useAuth();

  const postEvent = async (newEvent: CreateUpdateEventDTO) => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_EVENTS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(newEvent),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdEvent: EventView = await response.json();
      console.log('Created event with financial request:', createdEvent);
      return createdEvent;
    } catch (error: any) {
      console.error('Failed to create event with financial request:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postEvent, postEventError };
};

export default usePostEventWithFinancialRequest;
