import { UserData } from '../types/organizational-models';

import {
  DIRECTOR_FINANCIERO,
  PRESIDENTE,
  SECRETARIO,
  VICEPRESIDENTE_DE_CULTURA,
  VICEPRESIDENTE_FINANCIERO,
  VICEPRESIDENTE_GENERAL,
} from './roles-constants';

export const isFinantial = (user: UserData | null): boolean => {
  return (
    user?.role === VICEPRESIDENTE_FINANCIERO ||
    user?.role === DIRECTOR_FINANCIERO ||
    user?.role === PRESIDENTE
  );
};

export const isCulture = (user: UserData | null): boolean => {
  return user?.role === VICEPRESIDENTE_DE_CULTURA || user?.role === PRESIDENTE;
};

export const isInventory = (user: UserData | null): boolean => {
  return (
    user?.role === VICEPRESIDENTE_GENERAL ||
    user?.role === PRESIDENTE ||
    user?.role === SECRETARIO
  );
};

export const isOrganizational = (user: UserData | null): boolean => {
  return user?.role === PRESIDENTE || user?.role === VICEPRESIDENTE_GENERAL;
};
