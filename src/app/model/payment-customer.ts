
import { InvoiceFolder } from '@model/invoice-folder';
import { Customer } from '@model/customer';
import { Treasury } from '@model/treasury';
import { FolderFiles } from '@model/folder-files';

export class PaymentCustomer {
  uuid?: any;
  id?: any;
  code?: string;
  invoice?: InvoiceFolder;
  customer?: Customer;
  type?: string;
  tiers?: string;
  effectue?: string;
  etat?: string;
  status?: string;
  compte?: string;
  montant?: number;
  date?: string;
  mode?: string;
  treasury?: Treasury;
  banque?: string;
  cheque?: string;
  telephone?: string;
  reference?: string;
  remetant?:string;
  files?: File;
  folderUuid?: string;
  folder?: FolderFiles;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
  validation?: any;
  confiamtion?: any;
}
