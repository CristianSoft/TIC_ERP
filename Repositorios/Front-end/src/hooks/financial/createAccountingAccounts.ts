import { useState } from 'react';

import { Account } from '../../types/finantial-models';

import { CreateUpdateAccountingAccountDTO } from './updateAccountingAccountHook';
import { AccountingAccountDTO } from './fetchAccountingAccountHook';
import { useAuth } from '../../contexts/auth-context';

const usePostAccountingAccount = () => {
  const [postError, setPostError] = useState<string | null>(null);
  const { token } = useAuth();

  const postAccountingAccount = async (
    accountingAccountDTO: CreateUpdateAccountingAccountDTO
  ): Promise<AccountingAccountDTO> => {
    setPostError(null);

    try {
      console.log('papureeee', JSON.stringify(accountingAccountDTO));
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ACCOUNTING_ACCOUNTS_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(accountingAccountDTO),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const createdAccountingAccount: Account = await response.json();
      console.log('Posted accounting account:', createdAccountingAccount);
      return createdAccountingAccount;
    } catch (error: any) {
      console.error('Failed to create accounting account:', error);
      setPostError(error.message);
      throw error;
    }
  };

  return { postAccountingAccount, postError };
};

export default usePostAccountingAccount;
