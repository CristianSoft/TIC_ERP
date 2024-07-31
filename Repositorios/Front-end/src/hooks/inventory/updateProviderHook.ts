import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateProviderDTO {
  name: string;
  phone: string;
  email: string;
}

const useUpdateProvider = () => {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateProvider = async (
    id: number,
    updatedProvider: CreateUpdateProviderDTO
  ) => {
    setUpdateError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PROVIDERS_ENDPOINT}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(updatedProvider),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      if (response.status === 204) {
        console.log('Proveedor actualizado correctamente');
        return;
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to update provider:', error);
      setUpdateError(error.message);
      throw error;
    }
  };

  return { updateProvider, updateError };
};

export default useUpdateProvider;
