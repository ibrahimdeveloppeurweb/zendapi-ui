import { House } from '@model/house';
import { Owner } from '@model/owner';
import { Folder } from '@model/folder';
import { Invoice } from '@model/invoice';
import { OptionFunding } from '@model/option-funding';
import { PaymentCustomer } from '@model/payment-customer';
import { InvoiceRepayment } from '@model/invoice-repayment';
import { Spent } from './spent';

export interface Repayment {
  uuid?: any;
  id?: any;
  code?: string;
  house?: House;
  folder?: Folder;
  owner?: Owner;
  type?: string;
  etat?: boolean;
  date?: string;
  dateD?: string;
  dateF?: string;
  filtre?: string;
  montant?: number;
  aReverser?: number;
  commission?: number;
  tvaHonoraire?: number;
  prcImpot?: number;
  prcTva?: number;
  impot?: number;
  charge?: number;
  paye?: number;
  impaye?: number;
  totalNet?: number;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  montantLoyer?: number;
  prcCom?: number;
  total?: number;
  spents?: Spent[];
  options?: Option[];
  montantOptionFunding?: number;
  montantFunding?: number;
  montantSpent?: number;
  paymentCustomers?: PaymentCustomer[];
  optionFundings?: OptionFunding[];
  optionInvoiceRepayments?: OptionInvoiceRepayment[];
  invoiceRepayment?: InvoiceRepayment[];
  impotsFonciers?: ImpotFoncierRepayment[]; // ✅ AJOUTÉ
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
  comment?: string;
}

export interface Option {
  uuid?: any;
  id?: any;
  libelle?: any;
  prix?: number;
  remise?: number;
  qte?: number;
  tva?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}

export interface OptionInvoiceRepayment {
  uuid?: any;
  id?: any;
  libelle?: any;
  prix?: number;
  impot?: number;
  verse?: number;
  loyer?: number;
  montant?: number;
  tva?: number;
  tvaCom?: number;
  caution?: number;
  cautionDejaRverser?: number;
  invoice?: Invoice;
  commission?: number;
  periode?: number;
  impotPeriode?: string;
  impotApplique?: boolean;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  comment?: string;
}

// ✅ NOUVELLE INTERFACE
export interface ImpotFoncierRepayment {
  uuid?: string;
  id?: number;
  house?: House;
  periode?: string;
  periodicite?: string;
  montant?: number;
  prcImpot?: number;
  loyerAnnuelTotal?: number;
  etat?: string;
  libelle?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Alias pour compatibilité avec l'ancien code
export type optionInvoiceRepayments = OptionInvoiceRepayment;