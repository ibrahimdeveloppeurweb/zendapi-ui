import {Folder} from '@model/folder';
import { InvoiceFolder } from '@model/invoice-folder';

export interface FolderTerminate {
    id?: any
    uuid?: any
    code?: string;
    date?: string;
    etat?: string;
    signe?: string;
    folder?: Folder
    montant?: number
    invoice?: InvoiceFolder
    montantAgence?: number
    montantHt?: number
    montantTtc?: number
    montantTva?: number
    montantRemise?: number
    penalite?: number;
    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
}
