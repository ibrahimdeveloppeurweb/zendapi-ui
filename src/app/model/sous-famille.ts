import { Famille } from "./famille";
import { Ressource } from "./ressource";

export interface SousFamille {
    uuid?: string,
    code?: string,
    id?: number,
    libelle?: string,
    codification?:string,
    famille?: Famille,
    ressource?: Ressource[],
    createdAt?: string,
    updatedAt?: string,
    create?: string,
    update?: string,
    createBy?: string,
    searchableTitle?: string;
    searchableDetail?: string;
}