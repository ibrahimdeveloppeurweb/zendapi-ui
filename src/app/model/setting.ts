import { Country } from "@model/country";

export interface Setting {
  uuid?: any;
  id?: any;
  nom?: string;
  type?: string;
  agree?: boolean;
  ville?: string;
  commune?: string;
  quartier?: number;
  capital?: string;
  picture?: string;
  contact?: string;
  adresse?: string;
  dateG?: number;
  locaux?: string;
  faxe?: string;
  email?: string;
  nrc?: string;
  ncc?: string;
  impot?: number;
  prcFraisOrange?: number;
  prcFraisMtn?: number;
  prcFraisMoov?: number;
  prcFraisWave?: number;
  prcFraisDebitcard?: number;
  grace?: number;
  tva?: number;
  nbrSms?: number;
  sender?: string;
  entete?: string;
  piedPage?: string;
  photo?: string;
  photoSrc?: string;
  signature?: string;
  signatureSrc?: string;
  country?: Country;
}
