import { useState, useEffect } from 'react';

import { Member } from '../../types/organizational-models';
import { DEFAULT_STATE } from '../../utils/constants';
import { useAuth } from '../../contexts/auth-context';

const useFetchAdministrativeMembers = () => {
  const [administrativeMembers, setData] = useState<Member[]>([]);
  const [isLoadingAdministrativeMembers, setIsLoading] = useState(true);
  const [administrativeMemberErrors, setError] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ADMINISTRATIVE_MEMBERS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            mode: 'cors',
            
          }
          
        );
        console.log(token);
        if (!response.ok) {
          const errorData = await response.json(); // Lee el cuerpo de la respuesta
          throw new Error(
            `Error: ${response.status} ${response.statusText} - ${errorData.message}`
          );
        }

        const data: Member[] = await response.json();
        setData(data);
        console.log('Fetched data:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(Error('Error desconocido'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const updateAdministrativeMemberState = (
    id: number,
    updatedData: Partial<Member>
  ) => {
    setData((prevData) => {
      const newData = prevData.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated data:', newData);
      return newData;
    });
  };

  const addAdminMemberState = (newAdminMmeber: Member) => {
    setData((prevData) => {
      const newData = [...prevData, newAdminMmeber];
      console.log('Added new member:', newData, 'dsdsdsd');
      return newData;
    });
  };

  const filteredAdministrativeMembers = administrativeMembers.filter(
    (item) => item.state_id === DEFAULT_STATE
  );

  return {
    administrativeMembers: filteredAdministrativeMembers,
    addAdminMemberState,
    isLoadingAdministrativeMembers,
    administrativeMemberErrors,
    updateAdministrativeMemberState,
  };
};

export default useFetchAdministrativeMembers;
