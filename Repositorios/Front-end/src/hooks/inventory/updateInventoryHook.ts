import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateInventoryMovementDTO {
  date: string;
  product_Name: string;
  inventory_Movement_Type_Name: string;
  quantity: number;
}

const useUpdateInventoryMovement = () => {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateInventoryMovement = async (
    id: number,
    updatedInventoryMovement: CreateUpdateInventoryMovementDTO
  ) => {
    setUpdateError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_INVENTORY_MOVEMENTS_ENDPOINT}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(updatedInventoryMovement),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      if (response.status === 204) {
        console.log('Movimiento de inventario actualizado correctamente');
        return;
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to update inventory movement:', error);
      setUpdateError(error.message);
      throw error;
    }
  };

  return { updateInventoryMovement, updateError };
};

export default useUpdateInventoryMovement;
