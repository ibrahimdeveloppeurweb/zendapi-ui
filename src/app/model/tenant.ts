import { FolderFiles } from "@model/folder-files";

export interface User {
  uuid?: number;
  id?: number;
  email?: string;
  password?: string;
  username?: string;
}

export interface Tenant {
  uuid?: any;
  id?: any;
  agence_id?: string;
  type?: string;
  code?: string;
  etat?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  photo?: string;
  photoUuid?: string;
  folderUuid?: string;
  folder?: FolderFiles;
  photoSrc?: string;
  profession?: string;
  codePostal?: string;
  user?: User;
  ncc?: string;
  nrc?: string;
  capital?: Number;
  impaye?: Number;
  siegeSocial?: string;
  civilite?: string;
  dateN?: any;
  lieuN?: string;
  domicile?: string;
  numbWhatsapp?: string;
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
  searchableTitle?: string;
  searchableDetail?: string;
  contracts?: any
}
