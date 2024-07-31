import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/auth-context';

export interface AcademicPeriodDTO {
  academicPeriod: string;
}

const useFetchAcademicPeriods = () => {
  const [academicPeriodsData, setAcademicPeriodsData] = useState<string[]>([]);
  const [academicPeriodsLoading, setAcademicPeriodsLoading] = useState(true);
  const [academicPeriodsError, setAcademicPeriodsError] =
    useState<Error | null>(null);
  const { token } = useAuth();
  const endpoint = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_ACADEMIC_PERIODS_ENDPOINT}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',

        } );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: AcademicPeriodDTO[] = await response.json();
        setAcademicPeriodsData(data.map((period) => period.academicPeriod));
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setAcademicPeriodsError(error);
        } else {
          setAcademicPeriodsError(new Error('An unknown error occurred'));
        }
      } finally {
        setAcademicPeriodsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { academicPeriodsData, academicPeriodsLoading, academicPeriodsError };
};

export default useFetchAcademicPeriods;
