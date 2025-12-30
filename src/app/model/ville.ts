import { Country } from './country';
export interface Ville {
    id?: number,
    uuid?: string,
    libelle?: string,
    country?: Country,
    createdAt?: string,
    updatedAt?: string,
    create?: string,
    update?: string,
    createBy?: string,
    searchableTitle?: string;
    searchableDetail?: string;
}