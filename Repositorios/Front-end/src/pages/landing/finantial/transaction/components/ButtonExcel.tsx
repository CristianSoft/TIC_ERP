import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { DownloadIcon } from '@chakra-ui/icons';

import { Transaction } from '../../../../../types/finantial-models';
import { TRANSACTION_TABLE_HEADERS } from '../../../../../utils/constants';

interface ButtonExcelProps {
  data: Transaction[];
}

export const ButtonExcel = ({ data }: ButtonExcelProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const finalData = [TRANSACTION_TABLE_HEADERS];

    data.forEach((transaction) => {
      finalData.push([
        transaction.date,
        transaction.originAccount,
        transaction.destinationAccount,
        transaction.value.toString(),
        transaction.transactionType,
        transaction.description,
      ]);
    });

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(libro, hoja, 'Transacciones');

    setTimeout(() => {
      XLSX.writeFile(libro, 'DatosTransacciones.xlsx');
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
