import { Folder } from '@model/folder';
import { PaymentCustomer } from '@model/payment-customer';
import { Option } from 'ng-select/lib/option';

export interface InvoiceFolder {
  uuid?: any;
  id?: any;
  code?: string;
  type?: string;
  etat?: string;
  date?: string;
  folder?: Folder;
  option: [];
  options: Option[];
  payments: PaymentCustomer[];
  libelle?: string;
  designation?: string;
  montantHt?: number;
  montantTva?: number;
  montantRemise?: number;
  montantNonReverse?: number;
  montant?: number;
  periode?: string;
  paye?: number;
  impaye?: number;
  rembourser?: number;
  restant?: number;
  remise?: number;
  createdAtAt?: string;
  updatedAtAt?: string;
  create?: string;
  update?: string;
  createdAt?: string;
  updatedAt?: string;
}
