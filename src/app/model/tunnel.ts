import { Etape } from "./etape";


export interface Tunnel {
  id?: string;
  uuid?: string;
  code?: string;
  etapes?: Etape[];
  updatedAt?: string;
  createdAt?: string;
  create?: string;
  update?: string;
}
