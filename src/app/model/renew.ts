import {Contract} from '@model/contract';
import {Tenant} from '@model/tenant';
import {User} from '@model/user';
import {Invoice} from '@model/invoice';

export interface Renew {
  uuid?: any;
  id?: any;
  code?: string;
  invoice: Invoice;
  tenant?: Tenant;
  contract?: Contract;
  etat?: string;
  charge?: number;
  loyer?: number;
  date?: string;
  dateFin?: string;
  prcRetard?: number;
  limite?: number;
  pLimite?: number;
  pCharge?: number;
  pLoyer?: number;
  pDate?: string;
  pDateFin?: string;
  pPrcRetard?: number;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: User;
  update?: User;
  validate?: User;
  libelle?: string;
}


