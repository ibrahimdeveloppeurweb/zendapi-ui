import { Piece } from '@model/inventory';
import { Equipment } from '@model/equipment';

export interface OptionInventory {
  uuid?: any;
  id?: any;
  etat?: string;
  qte?: number;
  description?: string;
  piece?: Piece;
  equipment?: Equipment;
  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
