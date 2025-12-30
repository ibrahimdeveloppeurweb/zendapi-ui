import { Ville } from "./ville";

export interface Country {
  id?: any;
  uuid?: any;
  nom?: string;
  city?: Ville;
  indicatif?: string;
  capital?: string;
  monnaieCode?: string;
  monnaieNom?: string;
  mask?: string;
  isoCode2?: string;
  isoCode3?: string;
  isoNumber?: string;
  ltd?: string;
  photoSrc?: string;
  signatureSrc?: string;
  searchableTitle?: string;
  searchableDetail?: string;
}
