import {Contract} from '@model/contract';
import { OptionInventory } from '@model/option-inventory';

export interface Inventory {
  id?: any;
  uuid?: any;
  contract?: Contract;
  date?: string;
  etat?: string;
  type?: string;
  observation?: string;
  pieces?: Piece[];
  folderUuid?: string;
  folder?: any;
  signed?: any;
  montant?: number;
  create?: string;
  update?: string;
  validate?: string;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  searchableTitle?: string;
  searchableDetail?: string;
}

export interface Piece {
  uuid?: any;
  id?: any;
  libelle?: string;
  nom?: string;
  options?: OptionInventory[];
}
