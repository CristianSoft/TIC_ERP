import { useEffect, useState } from 'react';

import { CreateUpdateAccountingAccountDTO } from './updateAccountingAccountHook';
import { useAuth } from '../../contexts/auth-context';

export interface AccountingAccountDTO {
  id?: number;
  accountType: string;
  accountName: string;
  currentValue: number;
  date: string;
  initialBalance?: number;
  //accountingAccountStatus: string;
}

const useFetchAccountingAccounts = () => {
  const [accountingAccounts, setAccountingAccounts] = useState<
    AccountingAccountDTO[]
  >([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountErrors, setAccountErrors] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ACCOUNTING_ACCOUNTS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(endpoint,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json(); // Leer el cuerpo de la respuesta
          throw new Error(
            `Error: ${response.status} ${response.statusText} - ${errorData.message}`
          );
        }

        const data: AccountingAccountDTO[] = await response.json();
        setAccountingAccounts(data);
        console.log('Fetched accounting accounts:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setAccountErrors(error);
        } else {
          setAccountErrors(new Error('Unknown error'));
        }
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [endpoint]);

  const updateAccountState = (
    id: number,
    updatedData: Partial<AccountingAccountDTO>
  ) => {
    setAccountingAccounts((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated accounting accounts:', newData);
      return newData;
    });
  };

  const addAccountState = (newEvent: AccountingAccountDTO) => {
    setAccountingAccounts((prevData) => {
      const newData = [...prevData, newEvent];
      console.log('Added new member:', newData, 'dsdsdsd');
      return newData;
    });
  };
  return {
    accountingAccounts,
    isLoadingAccounts,
    accountErrors,
    updateAccountState,
    addAccountState,
  };
};

export default useFetchAccountingAccounts;
