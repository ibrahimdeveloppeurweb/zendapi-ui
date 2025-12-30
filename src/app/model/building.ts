import { Home } from '@model/home';
import { Promotion } from '@model/promotion';

export interface Building {
  id?: any;
  uuid?:any;
  code?:string;
  promotion?: Promotion;
  homes?: Home[];
  libelle?: string;
  niveau?: number;
  superficie?: number;
  prcEcheancier?: number;
  prcEtatA?: number;
  nbrMaison?: number;
  nbrMaisonV?: number;
  valeurMaison?: number;
  valeurMaisonV?: number;
  nbrMaisonR?: number;
  valeurMaisonR?: number;
  nbrMaisonD?: number;
  valeurMaisonD?: number;
  createdAt?: string;
  updatedAt?: string;
  createBy?: string;
  updateBy?: string;
  create?: string;
  update?: string;
}
