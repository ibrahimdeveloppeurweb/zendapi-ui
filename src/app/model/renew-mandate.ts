import {Mandate} from '@model/mandate';
import {Owner} from '@model/owner';
import {User} from '@model/user';

export interface RenewMandate {
  uuid?: any;
  id?: any;
  code?: string;
  owner?: Owner;
  mandate?: Mandate;
  etat?: string;
  taxe?: string;
  pTaxe?: string;
  facturation?: string;
  taxeCommission?: string;
  pTaxeCommission?: string;
  commission?: number;
  pCommission?: number;
  valeur?: number;
  pValeur?: number;
  date?: string;
  dateF?: string;
  dateD?: string;
  pDateF?: string;
  pDateD?: string;
  montantCom?: number;
  pMontantCom?: number;
  pDate?: string;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  validate?: string;
  create?: User;
  update?: User;
  libelle?: string;
}


