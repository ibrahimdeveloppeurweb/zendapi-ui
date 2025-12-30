import { User } from "./user";


export interface Confirmation {
  uuid?: any;
  id?: any;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
  create?: User;
  update?: User;
}
