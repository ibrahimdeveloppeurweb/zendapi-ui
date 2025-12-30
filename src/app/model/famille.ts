import { SousFamille } from "./sous-famille";
import { Ressource } from "./ressource";

export interface Famille {
    uuid?: string,
    code?: string,
    id?: number,
    libelle?: string,
    codification?:string,
    createdAt?: string,
    sousFamilles?: SousFamille[],
    ressource?: Ressource[],
    updatedAt?: string,
    create?: string,
    createBy?: string,
    update?: string
    photoSrc?: string
    searchableTitle?: string;
    searchableDetail?: string;
}