import { Invoice } from "@model/invoice";
import { Rental } from "@model/rental";
import { Tenant } from "@model/tenant";

export interface ShortContract {
  uuid?: any;
  id?: any;
  code?: any;
  etat?: string;
  type?: string;
  libelle?: string;
  periode?: string;
  rental?: Rental;
  tenant?: Tenant;
  folder?: any;
  signed?: any;
  dateEntr?: string;
  dateFin?: string;
  dateSign?: string;
  echeance?: string;
  invoice: Invoice;
  montant?: number;
  loyer?: number;
  charge?: number;
  nbr?: number;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  valide?: string;
  validateAt?: string;
  validate?: string;
}


