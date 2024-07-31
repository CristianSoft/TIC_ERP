import { getYear } from 'date-fns';

export const getCurrentYear = (): number => getYear(new Date());
