import { PaymentRepayment } from "./payment-repayment";
import { Repayment } from "./repayment";
import {Option} from './option';

export interface InvoiceRepayment {
  uuid?: any;
  id?: any;
  code?: string;
  type?: string;
  etat?: string;
  statut?: string;
  date?: string;
  repayment?: Repayment;
  options: Option[];
  payments: PaymentRepayment[];
  libelle?: string;
  designation?: string;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  montant?: number;
  periode?: string;
  paye?: number;
  impaye?: number;
  restant?: number;
  remise?: number;
  create?: string;
  update?: string;
  createdAt?: string;
  updatedAt?: string;
}
