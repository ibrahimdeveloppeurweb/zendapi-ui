import { Invoice } from "./invoice";

export interface Transaction {
  id?: any;
  uuid?: any;
  code?: string;
  reference?: string;
  amount?: number;
  fees?: number;
  repayment?: number;
  status?: string;
  invoices?: Invoice[];
  operator?: string;
  concern?: string;
  concerne?: string;
  disbursement?: any;
  bill?: any;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
}
