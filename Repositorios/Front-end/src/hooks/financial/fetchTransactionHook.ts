import { useEffect, useState } from 'react';

import { Transaction } from '../../types/finantial-models';

import { CreateUpdateTransactionDTO } from './createTransactionHook';
import { useAuth } from '../../contexts/auth-context';

const useFetchTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [transactionErrors, setTransactionErrors] = useState<Error | null>(
    null
  );
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TRANSACTIONS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
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

        const data: Transaction[] = await response.json();
        setTransactions(data);
        console.log('Fetched transactions:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setTransactionErrors(error);
        } else {
          setTransactionErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [endpoint]);

  const updateTransactionState = (
    id: number,
    updatedData: Partial<Transaction>
  ) => {
    setTransactions((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated transactions:', newData);
      return newData;
    });
  };
  const addTransactionState = (newEvent: CreateUpdateTransactionDTO) => {
    setTransactions((prevData) => {
      const newData = [...prevData, newEvent];
      console.log('Added new member:', newData, 'dsdsdsd');
      return newData;
    });
  };

  return {
    transactions,
    isLoadingTransactions,
    transactionErrors,
    updateTransactionState,
    addTransactionState,
  };
};

export default useFetchTransactions;
