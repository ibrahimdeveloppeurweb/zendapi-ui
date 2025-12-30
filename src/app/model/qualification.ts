import { Category } from './category';
import { Customer } from './customer';
import { Owner } from './owner';
import { Tenant } from './tenant';
import { User } from './user';
import { Service } from './service';
import { House } from './house';
import { Rental } from './rental';
import { Ressource } from './ressource';

export interface Qualification {
  uuid?: any;
  id?: any;
  type?:string;
  code?:string;
  etat?:string;
  libelle?:string;
  tenant?: Tenant;
  owner?: Owner;
  customer?: Customer;
  house?: House;
  rental?: Rental;
  ressource?: Ressource;
  user?: User;
  service?: Service;
  objet?:string;
  description?: Text;
  category?: Category;
  urgence?: string;
  date?: string; 
  create?: string; 
  update?: string; 
  createdAt?: Date; 
  updatedAt?: Date; 
 
}
