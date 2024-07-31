import { useState } from 'react';

import { Transaction } from '../../types/finantial-models';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateTransactionDTO {
  date: string;
  originAccount: string;
  destinationAccount: string;
  value: number;
  transactionType: string;
  description: string;
}

const usePostTransaction = () => {
  const [postTransactionError, setPostTransactionError] = useState<
    string | null
  >(null);

  const { token } = useAuth();

  const postTransaction = async (
    newTransaction: CreateUpdateTransactionDTO
  ) => {
    setPostTransactionError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_TRANSACTIONS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(newTransaction),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdTransaction: Transaction = await response.json();
      console.log('Created transaction:', createdTransaction);
      return createdTransaction;
    } catch (error: any) {
      console.error('Failed to create transaction:', error);
      setPostTransactionError(error.message);
      throw error;
    }
  };

  return { postTransaction, postTransactionError };
};

export default usePostTransaction;
