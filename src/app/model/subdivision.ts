import { Islet } from '@model/islet';
import { FolderFiles } from '@model/folder-files';

export interface Subdivision {
  uuid?: any;
  id?: any;
  code?: string;
  islet?: Islet[];
  photoSrc?: string;
  type?: string;
  nom?: string;
  etat?: string;
  date?: string;
  ville?: string;
  commune?: string;
  quartier?: string;
  localisation?: string;
  lng?: number;
  lat?: number;
  hectare?: number;
  are?: number;
  centiare?: number;
  nbrIlot?: number;
  photoUuid?: string;
  folder?: FolderFiles,
  folderUuid?: string,
  photo?: string;
  nbrLot?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  coordonnees?: any[]
  searchableTitle?: string;
  searchableDetail?: string;
}
