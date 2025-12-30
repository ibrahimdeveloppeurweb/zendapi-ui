import {House} from '@model/house';
import {Owner} from '@model/owner';
import { FolderFiles } from '@model/folder-files';
import { Contract } from '@model/contract';
import { PieceRental } from './piece-rental';

export interface Rental {
  uuid?: any;
  id?: any;
  code?: string;
  house?: House;
  contracts?: Contract[];
  nom?: string;
  libelle?: string;
  numerotation?: number;
  montant?: number;
  charge?: number;
  total?: number;
  porte?: string;
  etage?: string;
  etat?: string;
  occupant?: string;
  type?: string;
  piece?: number;
  pasPorte?: number;
  superficie?: number;
  photo?: string;
  blockHouse?:any;
  folder?: FolderFiles;
  photoSrc?: string;
  owner?: Owner;
  files?: File;
  pieces?: PieceRental[];
  createdAt?: string;
  create?: string;
  updatedAt?: string;
  update?: string;
}
