import { Invoice } from "./invoice";
import { ShortContract } from "./short-contract";

export interface ExtendContract {
  uuid?: any;
  id?: any;
  code?: any;
  date?: string;
  contract?: ShortContract;
  echeance?: string;
  invoice?: Invoice;
  dateFinP?: string;
  dateFinN?: string;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  valide?: string;
  validateAt?: string;
  validate?: string;
}


