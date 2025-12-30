import { Path } from "@model/path";

export interface Permission {
  uuid?: any;
  id?: any;
  nom?: string;
  paths?: Path[];
  create?: string;
  update?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}
