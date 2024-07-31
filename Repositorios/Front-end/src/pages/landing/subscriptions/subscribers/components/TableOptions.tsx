import { useState } from 'react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';

import { Subscriber } from '../../../../../types/subscription-models';
import { isOrganizational } from '../../../../../utils/check-role-helper';
import { useAuth } from '../../../../../contexts/auth-context';

import { AddSubscriberModal } from './AddSubscriberModal';
import { ButtonExcel } from './ButtonExcel';

interface TableOptionsProps {
  subscribers: Subscriber[];
  searchSubscriber: string;
  onSearchSubscriberChange: (name: string) => void;
  onAddSubscriber: (subscriber: Subscriber) => void;
}

export const TableOptions = ({
  subscribers,
  searchSubscriber,
  onSearchSubscriberChange,
  onAddSubscriber,
}: TableOptionsProps) => {
  const [isAddSubscriberModalOpen, setIsAddSubscriberModalOpen] =
    useState(false);

  const { user } = useAuth();
  return (
    <Flex
      sx={{
        flexDirection: { sm: 'column', lg: 'row' },
        gap: 'md',
        justifyContent: 'space-between',
      }}
    >
      <InputGroup sx={{ width: { sm: '100%', lg: 'md' } }}>
        <InputLeftElement>
          <SearchIcon sx={{ color: 'text.default' }} />
        </InputLeftElement>
        <Input
          value={searchSubscriber}
          placeholder="Buscar un aportante"
          onChange={(e) => onSearchSubscriberChange(e.target.value)}
        />
      </InputGroup>
      <Flex sx={{ gap: 'sm' }}>
        {isOrganizational(user) ? (
          <Button
            aria-label="addSubscriber"
            leftIcon={<AddIcon />}
            onClick={() => setIsAddSubscriberModalOpen(true)}
          >
            Aportante
          </Button>
        ) : null}
        <ButtonExcel data={subscribers} />
      </Flex>

      <AddSubscriberModal
        isOpen={isAddSubscriberModalOpen}
        onClose={() => setIsAddSubscriberModalOpen(false)}
        onAddSubscriber={onAddSubscriber}
      />
    </Flex>
  );
};
