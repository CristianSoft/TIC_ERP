import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { DownloadIcon } from '@chakra-ui/icons';

import { SubscriptionPlan } from '../../../../../types/subscription-models';
import { SUBSCRIPTION_PLAN_TABLE_HEADERS } from '../../../../../utils/constants';

interface ButtonExcelProps {
  data: SubscriptionPlan[];
}

export const ButtonExcel = ({ data }: ButtonExcelProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const finalData = [SUBSCRIPTION_PLAN_TABLE_HEADERS];

    data.forEach((plan) => {
      finalData.push([
        plan.planName,
        plan.price.toString(),
        plan.benefits,
        plan.academicPeriod,
      ]);
    });

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(libro, hoja, 'Planes Aportación');

    setTimeout(() => {
      XLSX.writeFile(libro, 'DatosPlanesAportacion.xlsx');
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {!loading ? (
        <Button leftIcon={<DownloadIcon />} onClick={handleDownload}>
          Excel
        </Button>
      ) : (
        <Button disabled>
          <Flex sx={{ gap: 'sm' }}>
            <Spinner size="sm" />
            <Text>Generando</Text>
          </Flex>
        </Button>
      )}
    </>
  );
};
