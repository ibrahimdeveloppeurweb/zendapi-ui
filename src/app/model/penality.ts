import { Contract } from '@model/contract';
import { Tenant } from '@model/tenant';
import { Customer } from '@model/customer';
import { Invoice } from '@model/invoice';
import { Transaction } from './transaction';

export interface Penality {
  uuid?: any;
  id?: any;
  code?: any;
  libelle?: string;
  etat?: boolean;
  invoice?: Invoice;
  customer?: Customer;
  contract?: Contract;
  tenant?: Tenant;
  mois?: string;
  montant?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  transactions?: Transaction[];
}
