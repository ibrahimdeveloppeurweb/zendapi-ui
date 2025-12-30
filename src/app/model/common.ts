import { Country } from "./country";
import { Quartier } from "./quartier";
import { Ville } from "./ville";
export interface Common {
    uuid?: string,
    id?: number,
    libelle?: string,
    country?: Country,
    city?: Ville,
    quartier?: Quartier,
    createdAt?: string,
    updatedAt?: string,
    create?: string,
    update?: string,
    createBy?: string,
    searchableTitle?: string;
    searchableDetail?: string;
}