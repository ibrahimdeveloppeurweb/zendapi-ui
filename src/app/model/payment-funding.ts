
import { InvoiceFunding } from '@model/invoice-funding';
import { FolderFiles } from '@model/folder-files';

export class PaymentFunding {
  uuid?: any;
  id?: any;
  code?: string;
  invoice?: InvoiceFunding;
  type?: string;
  tiers?: string;
  effectue?: string;
  etat?: string;
  status?: string;
  montant?: number;
  date?: string;
  mode?: string;
  banque?: string;
  cheque?: string;
  telephone?: string;
  reference?: string;
  remetant?:string;
  files?: File;
  folder?: FolderFiles;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  validateAt?: string;
  validate?: string;
  validation?: any;
  confiamtion?: any;
}
