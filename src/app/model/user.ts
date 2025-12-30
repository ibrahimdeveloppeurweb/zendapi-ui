import { Service } from '@model/service';
import { Permission } from '@model/permission';
import { FolderFiles } from '@model/folder-files';

export interface User {
  uuid?: any;
  id?: any;
  civilite?: string;
  sexe?: string;
  libelle?: string;
  username?: string;
  nom?: string;
  prenom?: string;
    telephone?: string;
  contact?: string;
  fonction?: string;
  service?: Service;
  email?: string;
  password?: string;
  role?: any[];
  droits?: Permission[];
  folder?: FolderFiles;
  photo?: string;
  photoSrc?: string;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
