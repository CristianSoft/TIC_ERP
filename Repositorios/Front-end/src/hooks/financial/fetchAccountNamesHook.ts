import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface AccountingAccountDTO {
  id: number;
  accountType: string;
  accountName: string;
  currentValue: number;
  date: string;
  initialBalance: number;
  accountingAccountStatus: string;
}

const useFetchAccountingAccountNames = () => {
  const [accountNames, setAccountNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ACCOUNTING_ACCOUNTS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchAccountNames = async () => {
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

        const data: AccountingAccountDTO[] = await response.json();
        setAccountNames(data.map((account) => account.accountName));
        console.log(
          'Fetched account names:',
          data.map((account) => account.accountName)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountNames();
  }, [endpoint]);

  return { accountNames, isLoading, error };
};

export default useFetchAccountingAccountNames;
