import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface FinancialRequestStateDTO {
  stateDescription: string;
}

export const useFetchFinancialStates = () => {
  const [financialStatesData, setFinancialStatesData] = useState<string[]>([]);
  const [financialStatesLoading, setFinancialStatesLoading] = useState(true);
  const [financialStatesError, setFinancialStatesError] =
    useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_FINANCIAL_STATES_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: FinancialRequestStateDTO[] = await response.json();
        setFinancialStatesData(data.map((state) => state.stateDescription));
        console.log(data); // Impresión de los datos
      } catch (error) {
        if (error instanceof Error) {
          setFinancialStatesError(error);
        } else {
          setFinancialStatesError(new Error('An unknown error occurred'));
        }
      } finally {
        setFinancialStatesLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { financialStatesData, financialStatesLoading, financialStatesError };
};

export default useFetchFinancialStates;
