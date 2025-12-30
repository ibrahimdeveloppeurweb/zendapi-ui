
import { Quote } from "../quote";
import { Option } from "../option";
import { Provider } from "../provider";
import { Construction } from "../construction";
import { HomeCo } from "../syndic/home-co";
import { HouseCo } from "../syndic/house-co";
import { Folder } from "@model/folder";
import { LoadCategory } from "@model/load-category";
import { InvoicePayment } from "./invoice-payment";

export interface InvoiceCo {
  uuid?: any;
  id?: any;
  code?: string;
  numero?: string;
  type?: string;
  name?: string;
  libelle?: string;
  echeance?: string;
  etat?: string;
  evolution?: string;
  date?: string;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  montant?: number;
  montantPaye?: number;
  nbOpt?: number;
  provider?: Provider;
  construction?: Construction;
  trustee?: any;
  house?: HouseCo;
  home?: HomeCo;
  infrastructure?: any;
  quote?: Quote
  ligneBudgetaire?: LoadCategory,
  payments?: InvoicePayment,
  options?: Option[];
  folder: Folder,
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  paye?: any
  impaye?: any
}

