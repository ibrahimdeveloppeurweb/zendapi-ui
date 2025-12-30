import { Islet } from '@model/islet';
import { Folder} from '@model/folder';

export interface Lot {
    uuid?: any;
    id?: any;
    code?: string;
    libelle?: string;
    acquereur?: string;
    quartier?: string;
    etat?: string;
    espace?: boolean;
    islet?: Islet;
    numero?: number;
    montant?: number;
    superficie?: number;
    lng?: number;
    lat?: number;
    nbrMaison?: number;
    folderCustomer?: Folder;
    folder?: string;
    ville?: string;
    commune?: string;
    createdAt?: string;
    photoSrc?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
    isDelete?: boolean;
    coordonnees?: any[]
    searchableTitle?: string;
    searchableDetail?: string;
}
