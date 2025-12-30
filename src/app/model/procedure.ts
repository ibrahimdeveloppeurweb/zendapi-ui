import { Category } from './category';
import { EtapeTraitement } from './etapeTraitement';

export interface Procedure {
  id?: any;
  uuid?:any;
  libelle?: string;
  category?: Category;
  optionProcesses?: any[];
  createdAt?: string;
  updatedAt?: string;
  createBy?: string;
  updateBy?: string;
  create?: string;
  update?: string;
}
