import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { DownloadIcon } from '@chakra-ui/icons';

import { EventView } from '../../../../types/event-models';
import { EVENTS_TABLE_HEADERS } from '../../../../utils/constants';

interface ButtonExcelProps {
  data: EventView[];
}

export const ButtonExcel = ({ data }: ButtonExcelProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const finalData = [EVENTS_TABLE_HEADERS];

    data.forEach((event) => {
      if (event.income) {
        finalData.push([
          event.title,
          event.status,
          event.description,
          event.startDate,
          event.endDate,
          event.budget.toString(),
          event.budgetStatus,
          event.location,
          event.income.toString(),
        ]);
      }
    });

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(libro, hoja, 'Eventos');

    setTimeout(() => {
      XLSX.writeFile(libro, 'DatosEventos.xlsx');
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
