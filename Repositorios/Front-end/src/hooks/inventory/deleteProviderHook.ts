import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

const useDeleteProvider = (deleteProviderState: (id: number) => void) => {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { token } = useAuth();


  const deleteProvider = async (id: number) => {
    setDeleteError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PROVIDERS_ENDPOINT}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
        }
      );

      if (response.status === 204) {
        deleteProviderState(id);
        console.log('Proveedor eliminado correctamente');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to delete provider:', error);
      setDeleteError(error.message);
      throw error;
    }
  };

  return { deleteProvider, deleteError };
};

export default useDeleteProvider;
