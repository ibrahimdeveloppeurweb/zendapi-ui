import { Provider } from "../provider";
import { HomeCo } from "../syndic/home-co";
import { HouseCo } from "../syndic/house-co";
import { InvoiceCo } from "./invoice-co";
export interface ProviderContract {
  uuid?: any;
  id?: any;
  code?: string;
  libelle?: string;
  description?: string;
  type?: string;
  etat?: string;
  montant?: number;
  periodicite?: String;
  searchableTitle?: string;
  budget?: number;
  dateSign?: string;
  dateD?: string;
  dateF?: string;
  trustee?: any;
  houseCo?: HouseCo;
  homeCo?: HomeCo;
  factures?: InvoiceCo[]
  infrastructure: any;
  ligneBudgetaire?: any;
  provider?: Provider;
  folder?: any;
  createdAt?: string;
  updatedAt?: string;
  createdAtAt?: string;
  updatedAtAt?: string;
  create?: string;
  update?: string;
}
