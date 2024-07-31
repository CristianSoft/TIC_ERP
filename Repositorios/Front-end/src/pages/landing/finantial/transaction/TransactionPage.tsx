import { Heading, Flex, Text, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { formatISO } from 'date-fns';

import { Transaction } from '../../../../types/finantial-models';

import usePostTransaction, {
  CreateUpdateTransactionDTO,
} from '../../../../hooks/financial/createTransactionHook';
import { useGenericToast } from '../../../../hooks/general/useGenericToast';

import { TransactionTable } from './components/TransactionTable';
import { EditTransactionModal } from './components/EditTransactionModal';
import useFetchTransactions from '../../../../hooks/financial/fetchTransactionHook';

export const TransactionPage = () => {
  const [isEditTransactionModalOpen, setEditTransactionModalOpen] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchTransaction, setSearchTransaction] = useState('');

  const { postTransaction } = usePostTransaction();
  const showToast = useGenericToast();

  const handleEditTransaction = (data: { transaction: Transaction }) => {
    console.log('Transacción actualizada:', data.transaction);
  };

  const handleDeleteTransaction = (id: number | undefined) => {
    console.log('Transacción eliminada:', id);
  };
  const openEditTransactionModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditTransactionModalOpen(true);
  };

  const {
    transactions,
    isLoadingTransactions,
    transactionErrors,
    addTransactionState,
  } = useFetchTransactions();

  const handleSearchTransactionChange = (name: string) => {
    setSearchTransaction(name);
  };

  const handleAddTransaction = async (newTransaction: Transaction) => {
    try {
      const formattedDate = formatISO(new Date(newTransaction.date));
      const updatedInfo: CreateUpdateTransactionDTO = {
        date: formattedDate,
        originAccount: newTransaction.originAccount,
        destinationAccount: newTransaction.destinationAccount,
        value: newTransaction.value,
        transactionType: newTransaction.transactionType,
        description: newTransaction.description,
      };

      const newAdminMember = await postTransaction(updatedInfo);

      addTransactionState(newAdminMember);
      showToast({
        title: 'Registro exitoso',
        description: 'La transacción se registró correctamente.',
        status: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        showToast({
          title: 'Error al añadir la transacción',
          description: error.message,
          status: 'error',
        });
      }
    }
  };

  return (
    <Flex
      flex="1"
      sx={{ flexDirection: 'column', gap: 'lg', px: { base: 'md', lg: '3xl' } }}
    >
      <Heading>Transacciones</Heading>
      <Text sx={{ color: 'text.default', textAlign: 'justify' }}>
        Antes de añadir una transacción, asegúrate de que las cuentas contables
        que necesitas ya se encuentren registradas. En caso de no estar seguro
        revisa las
        <Link
          href="/finanzas/cuentas-contables"
          sx={{ color: 'brand.blue', ml: '3xs' }}
        >
          cuentas contables disponibles.
        </Link>
      </Text>
      <TransactionTable
        transactions={transactions}
        onEdit={openEditTransactionModal}
        onDelete={handleDeleteTransaction}
        error={transactionErrors}
        isLoading={isLoadingTransactions}
        searchTransaction={searchTransaction}
        onSearchTransactionChange={handleSearchTransactionChange}
        onAddTransaction={handleAddTransaction}
      />

      <EditTransactionModal
        isOpen={isEditTransactionModalOpen}
        onClose={() => setEditTransactionModalOpen(false)}
        transaction={selectedTransaction}
        onSubmit={handleEditTransaction}
      />
    </Flex>
  );
};
