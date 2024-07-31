import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';

export interface CreateUpdateContributionPlanDTO {
  academic_Period_Name: string;
  price: number;
  benefits: string;
  planName: string;
}

const useUpdateContributionPlan = () => {
  const [updateError, setUpdateError] = useState<string | null>(null);
  const {token} = useAuth();

  const updateContributionPlan = async (
    id: number,
    updatedContributionPlan: CreateUpdateContributionPlanDTO
  ) => {
    setUpdateError(null);
    console.log(updatedContributionPlan);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_CONTRIBUTION_PLANS_ENDPOINT}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors',
          body: JSON.stringify(updatedContributionPlan),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error: ${response.status} ${response.statusText} - ${errorData.message}`
        );
      }

      if (response.status === 204) {
        console.log('Plan de contribución actualizado correctamente');
        return;
      }

      return await response.json();
    } catch (error: any) {
      console.error('Failed to update contribution plan:', error);
      setUpdateError(error.message);
      throw error;
    }
  };

  return { updateContributionPlan, updateError };
};

export default useUpdateContributionPlan;
