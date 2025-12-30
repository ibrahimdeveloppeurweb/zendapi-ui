import { Folder } from "@model/folder";
import { House } from '@model/house';
import { Home } from '@model/home';
import { Lot } from '@model/lot';

export interface Mutate {
  uuid?: any;
  id?: any;
  code?: any;
  etat?: string;
  montant?: number;
  montantRemise?: number;
  montantHt?: number;
  montantTva?: number;
  folder?: Folder;
  options?: OptionHouse[];
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
}

export interface OptionHouse {
  uuid?: any;
  id?: any;
  house?: House;
  lot?: Lot;
  home?: Home;
  prix?: number;
  new?: any;
  old?: any;
  tva?: number;
  remise?: number;
  total?: number;
}
