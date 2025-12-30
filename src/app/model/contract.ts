import { Rental } from '@model/rental';
import { Tenant } from '@model/tenant';
import { Invoice } from '@model/invoice';
import { Rent } from './rent';

export interface Contract {
  uuid?: any;
  id?: any;
  code?: string;
  rental?: Rental;
  invoices: Invoice[];
  entranceInvoice: Invoice;
  tenant?: Tenant;
  lastRent?: Rent;
  etat?: string;
  type?: string;
  charge?: number;
  loyer?: number;
  pasPorte?: number;
  cautionReverser?: string;
  loyerCharge?: number;
  montant?: number;
  caution?: number;
  avance?: number;
  dateSign?: string;
  dateEntr?: string;
  dateEcheance?: string;
  dateFa?: string;
  dateF?: string;
  dateE?: string;
  dateFin?: string;
  prcRetard?: number;
  limite?: number;
  isSigned?: boolean;
  moratoire?: boolean;
  renouveler?: boolean;
  periodicite?: string;
  pourcentageRetard?: any;
  moisAvance?: number;
  moisCaution?: number;
  libelle?: string;
  folder?: any;
  signed?: any;
  etatLieux: string;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  valide?: string;
  validateAt?: string;
  validate?: string;
  commission?: number;
}


