import { SubFamily } from "./sub-family";

export interface Product {
  id?: any;
  uuid?: any;
  code?: string;
  libelle?: string;
  prix?: string;
  etat?: string,
  type?: string,
  photoSrc?: string;
  account?: any;
  auxiliairy?: any;
  subFamily?: SubFamily;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  searchableTitle?: string;
  searchableDetail?: string;
}
