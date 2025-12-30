import { HomeType } from '@model/home-type';
import { Promotion } from "@model/promotion";
import { Folder } from "@model/folder";

export interface Home {
    uuid?: any;
    id?: any;
    code?: string;
    ilot?: number;
    lot?: number;
    type?: HomeType;
    tasks?: any;
    promotion?: Promotion;
    folderCustomer?: Folder;
    montant?: number;
    superficie?: number;
    photoUuid?: string;
    folderUuid?: string;
    photo?: string;
    folder?: string;
    etat?: string;
    acquereur?: string;
    photoSrc?: string;
    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
    searchableTitle?: string;
    searchableDetail?: string;
}
