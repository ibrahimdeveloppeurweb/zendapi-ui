import { Funding } from '@model/funding';
import { PaymentFunding } from '@model/payment-funding';

export interface InvoiceFunding {
  uuid?: any;
  id?: any;
  code?: string;
  etat?: string;
  date?: string;
  funding?: Funding;
  option: [];
  payments: PaymentFunding[];
  libelle?: string;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  montant?: number;
  paye?: number;
  impaye?: number;
  restant?: number;
  remise?: number;
  createdAtAt?: string;
  updatedAtAt?: string;
  create?: string;
  update?: string;
  validate?: string;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
}
