import { useEffect, useState } from 'react';

import { Supplier } from '../../types/supplier-models';
import { DEFAULT_STATE } from '../../utils/constants';
import { useAuth } from '../../contexts/auth-context';

const useFetchProviders = () => {
  const [providers, setProviders] = useState<Supplier[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [providerErrors, setProviderErrors] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PROVIDERS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchProviders = async () => {
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

        const data: Supplier[] = await response.json();
        setProviders(data);
        console.log('Fetched providers:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setProviderErrors(error);
        } else {
          setProviderErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [endpoint]);

  const updateProviderState = (id: number, updatedData: Partial<Supplier>) => {
    setProviders((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated providers:', newData);
      return newData;
    });
  };

  const addProviderState = (newContributionPlan: Supplier) => {
    setProviders((prevData) => {
      const newData = [...prevData, newContributionPlan];
      console.log('Added new associationd:', newData, 'dsdsdsd');
      return newData;
    });
  };
  const filteredProducts = providers.filter(
    (item) => item.stateid === DEFAULT_STATE // Adjust the filter condition as needed
  );
  return {
    providers: filteredProducts,
    isLoadingProviders,
    providerErrors,
    updateProviderState,
    addProviderState,
  };
};

export default useFetchProviders;