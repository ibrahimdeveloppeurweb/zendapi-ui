
import { Product } from '@model/product';

export interface Option {
  uuid?: any;
  id?: any;
  libelle?: string;
  product?: Product;
  prix?: number;
  qte?: number;
  tva?: number;
  remise?: number;
  total?: number;
  evolution?: boolean;
  prixMajore?: number;
}
