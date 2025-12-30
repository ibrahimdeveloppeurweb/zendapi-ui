import { Rent } from '@model/rent';
import { Invoice } from '@model/invoice';
import { Contract } from '@model/contract';

export interface Notice {
  uuid?: any;
  id?: any;
  code?: string;
  contract?: Contract;
  rent?: Rent;
  dateEmission?: string;
  mois?: string;
  paye?: number;
  impaye?: number;
  montant?: number;
  options?: Option[];
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
export interface Option {
  uuid?: any;
  id?: any;
  qte?: string;
  invoice?: Invoice;
  paye?: number;
  impaye?: number;
  montant?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
