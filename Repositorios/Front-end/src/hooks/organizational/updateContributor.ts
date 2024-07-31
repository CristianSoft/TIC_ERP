import { useState } from 'react';
import { Subscriber } from '../../types/subscription-models';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateContributorDTO {
  date: string; // Using string for simplicity, consider using a date library for better handling
  name: string;
  faculty: string;
  career: string;
  email: string;
  plan: string;
}

const useUpdateContributor = () => {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateContributor = async (
    id: number,
    updatedContributor: CreateUpdateContributorDTO
  ) => {
    setUpdateError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_CONTRIBUTORS_ENDPOINT}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(updatedContributor),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      /*if (response.status === 204) {
        console.log('Contribuyente actualizado correctamente');
        return;
      }*/

        const updatedContributorResponse: Subscriber = await response.json();
        console.log('Updated contributor poooooooost:', updatedContributorResponse);
        return updatedContributorResponse;
    } catch (error: any) {
      console.error('Failed to update contributor:', error);
      setUpdateError(error.message);
      throw error;
    }
  };

  return { updateContributor, updateError };
};

export default useUpdateContributor;
