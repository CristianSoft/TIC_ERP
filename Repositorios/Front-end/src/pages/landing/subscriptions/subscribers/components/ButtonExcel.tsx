import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { DownloadIcon } from '@chakra-ui/icons';

import { Subscriber } from '../../../../../types/subscription-models';
import { SUBSCRIBER_TABLE_HEADERS } from '../../../../../utils/constants';

interface ButtonExcelProps {
  data: Subscriber[];
}

export const ButtonExcel = ({ data }: ButtonExcelProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const finalData = [SUBSCRIBER_TABLE_HEADERS];

    data.forEach((subscriber) => {
      finalData.push([
        subscriber.date,
        subscriber.name,
        subscriber.faculty,
        subscriber.career,
        subscriber.email,
        subscriber.plan,
        subscriber.price?.toString() || '',
        subscriber.academicPeriod?.toString() || '',
      ]);
    });

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(libro, hoja, 'Aportantes');

    setTimeout(() => {
      XLSX.writeFile(libro, 'DatosAportantes.xlsx');
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
