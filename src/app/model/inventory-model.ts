import { HomeType } from "./home-type";

export interface InventoryModel {
    id?: any;
    uuid?: any;
    type?: HomeType;
    pieces?: any[];

    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
    searchableTitle?: string;
    searchableDetail?: string;
}
