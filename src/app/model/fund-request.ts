
import { Treasury } from '@model/treasury';
import { Day } from '@model/day';
import { FolderFiles } from '@model/folder-files';

export interface FundRequest {
  uuid?: any,
  id?: any,
  motif?: string,
  code?: string,
  etat?: string,
  day?: Day,
  status?: string,
  montantD?: number,
  montant?: number,
  date?: string,
  dateD?: string,
  treasury?: Treasury,
  details?: string,
  folder?: FolderFiles,
  folderUuid?: string,
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
}
