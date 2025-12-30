import { PieceRental } from "./piece-rental";
export interface Equipment{
  uuid?: any,
  id?: any,
  libelle?: string,
  description?: string,
  piece?: PieceRental,
  searchableTitle?: string;
  searchableDetail?: string;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
