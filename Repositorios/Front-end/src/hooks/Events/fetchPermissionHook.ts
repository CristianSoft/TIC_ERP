import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
export interface PermissionDTO {
  Permission_Id: number;
  Request: string;
  Request_Status: string;
}

export const useFetchPermissions = () => {
  const [permissions, setPermissions] = useState<PermissionDTO[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [permissionErrors, setPermissionErrors] = useState<Error | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PERMISSIONS_ENDPOINT}`;
  const { token } = useAuth();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(endpoint,  {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Error: ${response.status} ${response.statusText} - ${errorData.message}`
          );
        }

        const data: PermissionDTO[] = await response.json();
        setPermissions(data);
        console.log('Fetched permissions:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setPermissionErrors(error);
        } else {
          setPermissionErrors(Error('Unknown error'));
        }
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, [endpoint]);

  const updatePermissionState = (
    id: number,
    updatedData: Partial<PermissionDTO>
  ) => {
    setPermissions((prevData) => {
      const newData = prevData.map((item) =>
        item.Permission_Id === id ? { ...item, ...updatedData } : item
      );
      console.log('Updated permissions:', newData);
      return newData;
    });
  };

  return {
    permissions,
    isLoadingPermissions,
    permissionErrors,
    updatePermissionState,
  };
};

export default useFetchPermissions;
