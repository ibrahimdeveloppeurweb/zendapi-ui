import { Option } from "@model/option";
import { Provider } from "@model/provider";
import { Construction } from "@model/construction";
import { HomeCo } from "./syndic/home-co";
import { HouseCo } from "./syndic/house-co";
import { LoadCategory } from "./load-category";
import { Folder } from "./folder";

export interface Quote {
  uuid?: any;
  id?: any;
  code?: string;
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
  nbOpt?: number;
  provider?: Provider;
  construction?: Construction;
  trustee?: any;
  houseCo?: HouseCo;
  homeCo?: HomeCo;
  infrastructure?: any;
  ligneBudgetaire?: LoadCategory;
  options?: Option[];
  optionProductions?: any[];
  isBon?: boolean;
  folder?: Folder;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}

