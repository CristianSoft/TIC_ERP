import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

interface SemesterDTO {
  semester_Name: string;
}

const useFetchSemesters = () => {
  const [semesters, setData] = useState<string[]>([]);
  const [isLoadingSemesters, setIsLoading] = useState(true);
  const [semesterErrors, setError] = useState<string | null>(null);
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_SEMESTERS_ENDPOINT}`;
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

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: SemesterDTO[] = await response.json();
        setData(data.map((semester) => semester.semester_Name));
        console.log('Fetched data:', data);
      } catch (error: any) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { semesters, isLoadingSemesters, semesterErrors };
};

export default useFetchSemesters;
