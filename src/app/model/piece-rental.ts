
import { Rental } from '@model/rental';
import { FolderFiles } from './folder-files';

export interface PieceRental {
  id?: any;
  uuid?: any;
  libelle?: string;
  description?: string;
  rental?: Rental;
  options?: any[];
  searchableTitle?: string;
  searchableDetail?: string;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  folder?: FolderFiles;
  folderUuid?: [];
}
