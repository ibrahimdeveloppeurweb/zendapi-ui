
import { City } from "@model/city";
import { Country } from "@model/country";
import { Common } from "@model/common";
import { Neighborhood } from "@model/neighborhood";

export interface Besoin{
    uuid?: any;
    id?: any;
    code?: string;
    numero?: string;
    etat?: string;
    status?: string;
    date?: string;
    montant?: string;
    agency?: any;
    country?: Country;
    city?: City;
    common?: Common;
    neighborhood?: Neighborhood;
    prospect?: any;
    offres?: any[] ;
    sourcePaiement?: string;
    modePaiement?: string;
    type?: string;
    folder?: string;
    createdAt?: string;
    updatedAt?: string;
    create? : string;
    update?: string;
  
}