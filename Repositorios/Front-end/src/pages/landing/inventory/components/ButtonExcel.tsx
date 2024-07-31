import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { DownloadIcon } from '@chakra-ui/icons';

import { Inventory } from '../../../../types/inventory-models';
import { INVENTORY_TABLE_HEADERS } from '../../../../utils/constants';

interface ButtonExcelProps {
  data: Inventory[];
}

export const ButtonExcel = ({ data }: ButtonExcelProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const finalData = [INVENTORY_TABLE_HEADERS];

    data.forEach((inventory) => {
      finalData.push([
        inventory.product,
        inventory.movementType,
        inventory.quantity.toString(),
        inventory.date,
      ]);
    });

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(libro, hoja, 'Inventario');

    setTimeout(() => {
      XLSX.writeFile(libro, 'DatosInventario.xlsx');
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
