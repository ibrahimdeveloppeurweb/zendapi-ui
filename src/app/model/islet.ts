import { Lot } from '@model/lot';
import { Subdivision } from '@model/subdivision';

export interface Islet {
  uuid?: any;
  id?: any;
  subdivision?: Subdivision;
  lots?: Lot[];
  espace?: boolean;
  code?: string;
  numero?: number;
  superficie?: number;
  nbrLot?: number;
  nbrLotD?: number;
  nbrLotR?: number;
  nbrLotV?: number;
  valeurLot?: number;
  valeurLotD?: number;
  valeurLotR?: number;
  valeurLotV?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  coordonnees?: any[]
  searchableTitle?: string;
  searchableDetail?: string;
}
