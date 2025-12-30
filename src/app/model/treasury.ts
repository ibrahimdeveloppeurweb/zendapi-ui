import { User } from "@model/user";
import { Day } from "@model/day";

export interface Treasury {
  uuid?: any;
  id?: any;
  type?: string;
  nom?: string;
  compte?: string;
  seuilMin?: number;
  seuilMax?: number;
  solde?: number;
  days?: Day[];
  gerant?: User;
  validateurs?: User[];
  commentaire?: string;
  date?: string;
  photoSrc?: string;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
  searchableDetail?: string;
  searchableTitle?: string;
}
