import { Construction } from "@model/construction";
import { OptionFunding } from '@model/option-funding';
import { InvoiceFunding } from "@model/invoice-funding";

export interface Funding {
  uuid?: any;
  id?: any;
  montantP?: number;
  montantA?: number;
  mois?: number;
  interet?: number;
  code?: string;
  etat?: string;
  financeur?: string;
  date?: string;
  dateValid?: string;
  construction?: Construction;
  invoice?: InvoiceFunding;
  options?: OptionFunding[];
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  validateAt?: string;
  validate?: string;
}

