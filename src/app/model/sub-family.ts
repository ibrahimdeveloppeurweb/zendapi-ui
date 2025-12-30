import { Family } from "./Family";


export interface SubFamily {
    uuid?: string,
    code?: string,
    id?: number,
    libelle?: string,
    createdAt?: string,
    updatedAt?: string,
    create?: string,
    update?: string,
    family?: Family
}
