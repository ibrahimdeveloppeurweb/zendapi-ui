import { Country } from "./country";

export interface Provider {
  uuid?: any;
  id?: any;
  type?: string;
  civilite?: string;
  nom?: string;
  sexe?: string;
  service?: string;
  domicile?: string;
  email?: string;
  searchableTitle?: string;
  telephone?: string;
  codePostal?: string;
  naturePiece?: string;
  numPiece?: string;
  ncc?: string;
  nrc?: string;
  photoSrc?: string;
  pays?: Country
  groupe?: string
  job?: any
  folder?: any
  ville?: string
  commune?: string
  quartier?: string
  numRegistre?: string
  registreCom?: string
  statutEntreprise?: string
  dfe?: string
  dateDelivre?: string
  dateExpire?: string
  pieceRepresentant?: string
  juridique?: string
  compte?: string
  prestation?: string
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  account?: any;
  solde?: number;
  numero?: string;
  auxiliary?: any
}
