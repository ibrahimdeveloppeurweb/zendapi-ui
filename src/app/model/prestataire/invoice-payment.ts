import { Folder } from "@model/folder";
import { InvoiceCo } from "@model/prestataire/invoice-co";
export interface InvoicePayment {
  uuid?: any;
  id?: any;
  code?: string;
  type?: string;
  etat?: string;
  statut?: string;
  date?: string;
  invoice?: InvoiceCo;
  libelle?: string;
  methode?: string;
  description?: string;
  montantHt?: number;
  montantTva?: number;
  folder: Folder,
  create?: string;
  update?: string;
  createdAt?: string;
  updatedAt?: string;
  provider?: any
}
