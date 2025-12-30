import { Contract } from "@model/contract";
import { Invoice } from "@model/invoice";
import { Tenant } from "@model/tenant";

export interface Rent{
  uuid?: any;
  id?: any,
  code?: string,
  libelle?: string,
  type?: string,
  etat?: boolean,
  contract?: Contract,
  invoice?: Invoice,
  tenant?: Tenant,
  mois?: string;
  date?: string;
  montant?: number;
  charge?: number;
  loyer?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  groupedContract?: any
}
