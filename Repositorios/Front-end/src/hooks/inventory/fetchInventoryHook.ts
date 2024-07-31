import { useEffect, useState } from 'react';

import { Inventory } from '../../types/inventory-models';
import { DEFAULT_STATE } from '../../utils/constants';
import { useAuth } from '../../contexts/auth-context';

const useFetchInventoryMovements = () => {
  const [inventoryMovements, setInventoryMovements] = useState<Inventory[]>([]);
  const [isLoadingInventoryMovements, setIsLoadingInventoryMovements] =
    useState(true);
  const [inventoryMovementErrors, setInventoryMovementErrors] =
    useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_INVENTORY_MOVEMENTS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchInventoryMovements = async () => {
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

        const data: Inventory[] = await response.json();
        setInventoryMovements(data);
        console.log('Fetched inventory movements:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setInventoryMovementErrors(error);
        } else {
          setInventoryMovementErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingInventoryMovements(false);
      }
    };

    fetchInventoryMovements();
  }, [endpoint]);

  const updateInventoryMovementState = (
    id: number,
    updatedData: Partial<Inventory>
  ) => {
    setInventoryMovements((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated inventory movements:', newData);
      return newData;
    });
  };

  const filteredInventoryMovements = inventoryMovements.filter(
    (item) => item.stateid === DEFAULT_STATE // Adjust the filter condition as needed
  );

  const addInventoryMovementState = (newContributionPlan: Inventory) => {
    setInventoryMovements((prevData) => {
      const newData = [...prevData, newContributionPlan];
      console.log('Added new associationd:', newData, 'dsdsdsd');
      return newData;
    });
  };

  return {
    inventoryMovements: filteredInventoryMovements,
    isLoadingInventoryMovements,
    inventoryMovementErrors,
    updateInventoryMovementState,
    addInventoryMovementState,
  };
};

export default useFetchInventoryMovements;
