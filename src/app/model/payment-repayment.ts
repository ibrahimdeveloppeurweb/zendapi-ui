import { FolderFiles } from '@model/folder-files';
import {InvoiceRepayment} from './invoice-repayment';
import { Repayment } from './repayment';
import { Treasury } from './treasury';

export interface PaymentRepayment {
  uuid?: any;
  id?: any;
  code?: string;
  etat?: string;
  status?: string;
  compte?: string;
  treasury: Treasury;
  repayment: Repayment;
  invoice?: InvoiceRepayment;
  montant?: number;
  effectue?: string;
  date?: string;
  mode?: string;
  checked?: boolean;
  source?: string;
  numero?: string;
  telephone?: string;
  type?: string;
  reference?: string;
  tiers?: string;
  folder?: FolderFiles;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  validate?: string;
  create?: string;
  update?: string;
  validation?: any;
  confiamtion?: any;
}
