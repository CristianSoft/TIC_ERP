import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateAccountingAccountDTO {
  accountType: string;
  accountName: string;
  currentValue: number;
  date: string;
  initialBalance: number;
  //accountingAccountStatus: string;
}

const useUpdateAccountingAccount = () => {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateAccountingAccount = async (
    id: number,
    updatedAccount: CreateUpdateAccountingAccountDTO
  ) => {
    setUpdateError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ACCOUNTING_ACCOUNTS_ENDPOINT}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(updatedAccount),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      if (response.status === 204) {
        console.log('Cuenta contable actualizada correctamente');
        return;
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to update accounting account:', error);
      setUpdateError(error.message);
      throw error;
    }
  };

  return { updateAccountingAccount, updateError };
};

export default useUpdateAccountingAccount;
