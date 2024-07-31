import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface AccountTypeDTO {
  account_Type_Name: string;
}

const useFetchAccountTypes = () => {
  const [accountTypesData, setAccountTypesData] = useState<string[]>([]);
  const [accountTypesLoading, setAccountTypesLoading] = useState(true);
  const [accountTypesError, setAccountTypesError] = useState<Error | null>(
    null
  );
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ACCOUNT_TYPES_ENDPOINT}`;
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

        const data: AccountTypeDTO[] = await response.json();
        setAccountTypesData(data.map((type) => type.account_Type_Name));
        console.log(data); // Impresión de los datos
      } catch (error) {
        if (error instanceof Error) {
          setAccountTypesError(error);
        } else {
          setAccountTypesError(new Error('An unknown error occurred'));
        }
      } finally {
        setAccountTypesLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { accountTypesData, accountTypesLoading, accountTypesError };
};

export default useFetchAccountTypes;
