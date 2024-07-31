import { useToast, UseToastOptions } from '@chakra-ui/react';

export const useGenericToast = () => {
  const toast = useToast();

  const showToast = (options: UseToastOptions) => {
    toast({
      ...options,
      duration: options.duration || 9000,
      isClosable: options.isClosable !== undefined ? options.isClosable : true,
      position: options.position || 'top',
    });
  };

  return showToast;
};
