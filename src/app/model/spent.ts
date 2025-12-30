import { Day } from '@model/day';
import { User } from '@model/user';
import { House } from '@model/house';
import { Folder } from '@model/folder';
import { Treasury } from '@model/treasury';
import { FolderFiles } from '@model/folder-files';

export interface OptionSpent {
  id?: string;
  uuid?: string;
  libelle?: string;
  qte?: number;
  tva?: number;
  prix?: number;
  remise?: number;
  total?: number;
}

export interface Spent {
  id?: string;
  uuid?: string;
  code?: string;
  treasury?: Treasury;
  day?: Day;
  date?: string;
  motif?: string;
  type?: string;
  reverse?: string;
  receiver?: string;
  etat?: string;
  status?: string;
  priorite?: string;
  description?: string;
  options?: any[];
  montant?: number;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  demandeur?: User;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
  ligne?: any;
  trustee?: any;
  houseCo?: any;
  homeCo?: any;
  folder?: any;
  house?: any;
  infrastructure?: any;
}
