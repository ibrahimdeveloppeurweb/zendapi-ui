import { Budget } from "@model/budget";
import { Folder } from "../folder";

export interface Syndic {
    uuid?: any;
    id?: any;
    code?: string;
    type?: string;
    nom?: string;
    ville?: string;
    pays?: any;
    commune?: string;
    quartier?: string;
    nom_prenoms?: string;
    email?: string;
    contact?: string;
    lat: any,
    lng: any
    agency?: any;
    mandate?: any;
    tantiemeType?: any;
    tantiemeValue?: any;
    typeTantiemes?: any[];
    housesCo?: any[];
    homesCo?: any[];
    contactPrSyndic?: any
    photoSrc?: any

    folderUuid?: string;
    folder?: any;
    etat?: string;
    photo?: any

    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;

    account?: any;
    auxiliairy?: any;

    credit?: number;
    debit?: number;
    currentBudget?: Budget;
    mode?: string;
}
