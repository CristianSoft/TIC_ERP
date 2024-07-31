import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { DownloadIcon } from '@chakra-ui/icons';

import { BudgetRequest } from '../../../../../types/event-models';
import { BUDGET_REQUEST_TABLE_HEADERS } from '../../../../../utils/constants';

interface ButtonExcelProps {
  data: BudgetRequest[];
}

export const ButtonExcel = ({ data }: ButtonExcelProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const finalData = [BUDGET_REQUEST_TABLE_HEADERS];

    data.forEach((request) => {
      finalData.push([
        request.eventName,
        request.requestStatusName,
        request.reason,
        request.value.toString(),
      ]);
    });

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

    setTimeout(() => {
      XLSX.writeFile(libro, 'DatosProductos.xlsx');
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
