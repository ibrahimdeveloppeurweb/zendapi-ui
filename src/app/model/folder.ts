import { InvoiceFolder } from '@model/invoice-folder';
import {Repayment} from '@model/repayment';
import { Customer } from '@model/customer';
import { House } from '@model/house';
import { User } from '@model/user';
import { Home } from '@model/home';
import { Lot } from '@model/lot';
import { FolderFiles } from "@model/folder-files";

export interface OptionFolder {
  uuid?: any;
  id?: any;
  libelle?: string;
  prix?: number;
  qte?: number;
  tva?: number;
  remise?: number;
  total?: number;
}

export interface OptionHouse {
  uuid?: any;
  id?: any;
  house?: House;
  lot?: Lot;
  home?: Home;
  prix?: number;
  qte?: number;
  tva?: number;
  remise?: number;
  montant?: number;
  total?: number;
  libelle?: string;
}

export interface EcheanceFolder {
  uuid?: any;
  id?: any;
  date?: string;
  montant?: number;
  etat?: string;
  description?: number;
}

export interface Advance {
  uuid?: any;
  id?: any;
  libelle?: string;
  montant?: number;
  etat?: string;
  prc?: number;
}

export interface Folder {
  uuid?: any;
  id?: any;
  code?: any;
  ref?: any;
  isSigned?: boolean;
  customer?: Customer;
  repayments?: Repayment[]
  invoice?: InvoiceFolder;
  frais?: number;
  date?: string;
  motif?: string;
  etat?: string;
  montant?: number;
  montantHt?: number;
  montantTva?: number;
  remise?: number;
  montantTotal?: number;
  montantAvance?: number;
  modalite?: string;
  montantFrais?: number;
  nbrMois?: number;
  montantBien?: number;
  charge?: User;
  houses?: OptionHouse[];
  echeances?: EcheanceFolder[];
  advances?: Advance[];
  folderUuid?: string;
  folder?: FolderFiles;
  options?: OptionFolder[];
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
