import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface RoleDTO {
  role_Name: string;
}
const useFetchRoles = () => {
  const [roles, setData] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoading] = useState(true);
  const [roleErrors, setError] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ROLES_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: RoleDTO[] = await response.json();
        setData(data.map((role) => role.role_Name));
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(Error(error.message));
        } else {
          setError(Error('An unknown error occurred'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { roles, isLoadingRoles, roleErrors };
};

export default useFetchRoles;
