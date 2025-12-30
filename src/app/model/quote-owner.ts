import { Option } from "@model/option";
import { Provider } from "@model/provider";
import { Construction } from "@model/construction";
import { HomeCo } from "./syndic/home-co";
import { HouseCo } from "./syndic/house-co";
import { LoadCategory } from "./load-category";
import { Folder } from "./folder";
import { House } from "./house";

export interface QuoteProvider {
  id?: number;
  uuid?: string;
  libelle?: string | null;
  type?: "PRESTATION" | "FOURNITURE" | string;
  echeance?: string | null;
  date?: string | null;
  dateValid?: string | null;
  prestation?: any;
  montant?: number;
  montantHt?: number;
  montantTva?: number;
  montantDifference?: number;
  montantRemise?: number | null;
  montantInitial?: number | null;
  isBon?: boolean | null;
  provider?: Provider;
  options?: Option[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteOwner {
  id?: number;
  uuid?: string;
  code?: string;
  libelle?: string | null;
  etat?: "INVALIDE" | "VALIDE" | string;
  evolution?: boolean;
  dateValid?: string | null;
  type?: string | null;
  date?: string | null;
  echeance?: string | null;
  prestation?: number;
  montant?: number;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  montantDifference?: number;
  isBon?: boolean;
  
  // Relationshouse
  construction?: Construction;
  quoteProviders?: QuoteProvider[];
  houseCo?: HouseCo | null;
  house?: House | null;
  homeCo?: HomeCo | null;
  trustee?: any;
  infrastructure?: any;
  folder?: Folder | null;
  ligneBudgetaire?: LoadCategory;
  
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}