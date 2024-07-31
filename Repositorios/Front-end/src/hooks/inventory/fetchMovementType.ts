import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

export interface InventoryMovementTypeDTO {
  movement_Type_Name: string;
}

const useFetchInventoryMovementTypes = () => {
  const [inventoryMovementTypes, setInventoryMovementTypes] = useState<
    InventoryMovementTypeDTO[]
  >([]);
  const [isLoadingInventoryMovementTypes, setIsLoadingInventoryMovementTypes] =
    useState(true);
  const [inventoryMovementTypeErrors, setInventoryMovementTypeErrors] =
    useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_INVENTORY_MOVEMENT_TYPES_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchInventoryMovementTypes = async () => {
      try {
        const response = await fetch(endpoint,  {
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

        const data: InventoryMovementTypeDTO[] = await response.json();
        setInventoryMovementTypes(data);
        console.log('Fetched inventory movement types:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setInventoryMovementTypeErrors(error);
        } else {
          setInventoryMovementTypeErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingInventoryMovementTypes(false);
      }
    };

    fetchInventoryMovementTypes();
  }, [endpoint]);

  return {
    inventoryMovementTypes,
    isLoadingInventoryMovementTypes,
    inventoryMovementTypeErrors,
  };
};

export default useFetchInventoryMovementTypes;
