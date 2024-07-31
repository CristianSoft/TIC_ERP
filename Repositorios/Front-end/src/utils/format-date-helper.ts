import { parseISO, format, isValid } from 'date-fns';

export const formatDate = (dateString: string) => {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate) ? format(parsedDate, 'dd-MM-yyyy') : dateString;
};
