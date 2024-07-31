import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateFinantialRequestDTO {
  eventName: string;
  requestStatusName: string; //EN REVISION, APROBADO, RECHAZADO
  reason: string;
  value: number;
}

const useUpdateFinantialRequest = () => {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateFinantialRequest = async (
    id: number,
    updatedFinantialRequest: CreateUpdateFinantialRequestDTO
  ) => {
    setUpdateError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_FINANTIAL_REQUESTS_ENDPOINT}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(updatedFinantialRequest),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      if (response.status === 204) {
        console.log('Solicitud financiera actualizada correctamente');
        return;
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to update financial request:', error);
      setUpdateError(error.message);
      throw error;
    }
  };

  return { updateFinantialRequest, updateError };
};

export default useUpdateFinantialRequest;
