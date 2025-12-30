import { User } from '@model/user';

export interface Service {
    uuid?: any;
    id?: any;
    code?: string;
    nom?: string;
    direction?: string;
    description?: string;
    responsable?: User;
    users?: User[];
    photoSrc?: string;
    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
}
