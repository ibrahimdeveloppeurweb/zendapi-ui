import { Common } from "./common";
import { Country } from "./country";
import { Ville } from "./ville";

export interface Quartier {
    uuid?: string,
    id?: number,
    libelle?: string,
    common?: Common,
    city?: Ville,
    country?: Country,
    createdAt?: string,
    updatedAt?: string,
    create?: string,
    update?: string,
    createBy?: string,
    searchableTitle?: string;
    searchableDetail?: string;
}