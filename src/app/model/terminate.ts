import {Contract} from '@model/contract';
import {Invoice} from '@model/invoice';

export interface Option {
  id?: any;
  uuid?: any;
  libelle?: string;
  prix?: number;
  qte?: number;
  tva?: number;
  remise?: number;
  total?: number;
}

export interface Return {
  id?: any;
  uuid?: any;
  libelle?: string;
  prix?: number;
}

export interface Deduct {
  id?: any;
  uuid?: any;
  libelle?: string;
  prix?: number;
}

export interface Terminate {
  id?: any;
  uuid?: any;
  code?: string;
  etat?: string;
  signe?: string;
  date?: string;
  echeance?: string;
  options?: Option[];
  returns?: Return[];
  deducts?: Deduct[];
  montant?: number;
  montantRetour?: number;
  montantDeduire?: number;
  contract?: Contract;
  invoice?: Invoice;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
}
