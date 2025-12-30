import { Funding } from "@model/funding";

export interface OptionFunding {
  uuid?: any;
  id?: any;
  mensualite?: number;
  libelle?: string;
  funding?: Funding;
  capitale?: number;
  periode?: string;
  reverse?: string;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
