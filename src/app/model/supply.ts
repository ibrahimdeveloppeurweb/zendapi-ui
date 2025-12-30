import { Treasury } from '@model/treasury';
export interface Supply {
  uuid?: any;
  id?: any;
  searchableTitle?: string;
  treasury?: Treasury;
  emetteur?: Treasury;
  recepteur?: Treasury;
  libelle?: string;
  motif?: string;
  type?: string;
  description?: string;
  code?: string;
  montant?: number;
  source?: string;
  numero?: string;
  date?: string;
  mode?: string;
  folder?: any;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
  house?: any;
}
