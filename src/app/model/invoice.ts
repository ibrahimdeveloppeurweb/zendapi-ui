import { Rent } from '@model/rent';
import { Contract } from '@model/contract';
import { Option } from '@model/option';
import { Payment } from '@model/payment';
import { Transaction } from '@model/transaction';
import { ShortContract } from '@model/short-contract';
import { Mandate } from './mandate';

export interface Deadlines {
  uuid?: any;
  id?: any;
  invoice?: Invoice;
  etat?: string;
  date?: string;
  description?: string;
  montant?: number;
}

export interface Invoice {
  uuid?: any;
  id?: any;
  code?: string;
  isPay?: boolean;
  type?: string;
  etat?: string;
  statut?: string;
  date?: string;
  echeance?: string;
  contract?: Contract;
  short?: ShortContract;
  rent?: Rent;
  options: Option[];
  deadlines: Deadlines[];
  option: [];
  payments: Payment[];
  libelle?: string;
  designation?: string;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  montantNonReverse?: number;
  montant?: number;
  periode?: string;
  paye?: number;
  impaye?: number;
  restant?: number;
  remise?: number;
  createdAtAt?: string;
  updatedAtAt?: string;
  create?: string;
  update?: string;
  createdAt?: string;
  updatedAt?: string;
  transactions?: Transaction[];
  groupedContract?: any
  mandate?: MandateInfo;
  factures?: any[];
  impots?: any[];
}

interface MandateInfo {
  periodicite: string;
  commission: number;
  taxeCommission: string;
  tvaCommissionCharge: string;
  taxe: string;
  charge: string;
  facturation: string;
  verseCom: string;
  montantGarantie: number;
  montantGarantieGlobal: number;
  partCharge: number;
}