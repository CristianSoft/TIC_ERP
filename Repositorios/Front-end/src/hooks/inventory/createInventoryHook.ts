import { useState } from 'react';

import { Inventory } from '../../types/inventory-models';

import { CreateUpdateInventoryMovementDTO } from './updateInventoryHook';
import { useAuth } from '../../contexts/auth-context';

const usePostInventoryMovement = () => {
  const [postError, setPostError] = useState<string | null>(null);
  const { token } = useAuth();

  const postInventoryMovement = async (
    inventoryMovementDTO: CreateUpdateInventoryMovementDTO
  ) => {
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_INVENTORY_MOVEMENTS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(inventoryMovementDTO),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdInventoryMovement: Inventory = await response.json();
      console.log('Posted inventory movement:', createdInventoryMovement);
      return createdInventoryMovement;
    } catch (error: any) {
      console.error('Failed to create inventory movement:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postInventoryMovement, postError };
};

export default usePostInventoryMovement;
