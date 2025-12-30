import { Mandate } from '@model/mandate';
import { Owner } from '@model/owner';

export interface TerminateMandate {
  id?: any;
  uuid?: any;
  code?: string;
  etat?: string;
  date?: string;
  owner?: Owner;
  mandate?: Mandate;
  createdAt?: string;
  updatedAt?: string;
  validateAt?: string;
  create?: string;
  update?: string;
  validate?: string;
}
