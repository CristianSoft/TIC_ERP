import React, { useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import * as XLSX from 'xlsx';

import { Supplier } from '../../../../types/supplier-models';
import { SUPPLIERS_TABLE_HEADERS } from '../../../../utils/constants';

interface ButtonExcelProps {
  data: Supplier[];
}

export const ButtonExcel = ({ data }: ButtonExcelProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const finalData = [SUPPLIERS_TABLE_HEADERS];

    data.forEach((supplier) => {
      finalData.push([supplier.name, supplier.phone, supplier.email]);
    });

    const libro = XLSX.utils.book_new();

    const hoja = XLSX.utils.aoa_to_sheet(finalData);

    XLSX.utils.book_append_sheet(libro, hoja, 'Proveedores');

    setTimeout(() => {
      XLSX.writeFile(libro, 'DatosProveedores.xlsx');
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
