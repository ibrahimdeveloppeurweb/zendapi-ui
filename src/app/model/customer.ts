import { FolderFiles } from '@model/folder-files';
import {User} from './user';

export interface user {
  uuid?: any;
  id?: any;
  email?: string;
  password?: string;
  username?: string;
}

export interface Customer {
  uuid?: any;
  id?: any;
  agence_id?: string;
  type?: string;
  impaye?: number;
  code?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  numbWhatsapp?: string;
  photo?: string;
  folder?: FolderFiles;
  photoUuid?: string;
  folderUuid?: [];
  photoSrc?: string;
  profession?: string;
  codePostal?: string;
  user?: User;
  ncc?: string;
  nrc?: string;
  capital?: Number;
  siegeSocial?: string;
  civilite?: string;
  dateN?: any;
  lieuN?: string;
  domicile?: string;
  posteOccupe?: string;
  naturePiece?: string;
  autrePiece?: string;
  dateEmission?: any;
  numPiece?: string;
  sexe?: string;
  nomResponsable?: string;
  telResponsable?: string;
  signatureAutorite?: string;
  dateExpirePiece?: any;
  nationalite?: string;
  situationMatrimoniale?: string;
  enfant?: number;
  nomUrgence?: string;
  affiniteUrgence?: string;
  contactUrgence?: string;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  isDelete?: boolean;
  pourcentageRetard?: number;
  searchableTitle?: string;
  searchableDetail?: string;
}
