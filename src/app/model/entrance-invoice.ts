import {Contract} from '@model/contract';
import {Owner} from '@model/owner';
import {Tenant} from '@model/tenant';

export interface EntranceInvoice {
  uuid?: any;
  id?: any;
  ref?: string;
  type?: string;
  owner?: Owner;
  tenant?: Tenant;
  etat?: string;
  contract?: Contract;
  montant_total?: number;
  montant_payer?: number;
  montant_restant?: number;
  date?: string;
  statut?: number;
  libelle?: string;
  montantHt?: number;
  montantTva?: number;
  montant?: number;
  paye?: number;
  impaye?: number;
  restant?: number;
  remise?: number;
  createdAt?: string;
  updatedAt?: string;
  createBy?: string;
  updateBy?: string;
  groupedContract?: any;
}
