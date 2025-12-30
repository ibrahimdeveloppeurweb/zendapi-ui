import { FolderFiles } from "@model/folder-files";
import { Folder } from "../folder";
import { HouseCo } from "./house-co";
import { Syndic } from "./syndic";

export interface HomeCo {
  uuid?: any;
  id?: any;
  nom?: string;

  etage?: string;
  numPorte?: string;
  type?: string;
  lot?: string;
  ilot?: string;
  lng?: number;
  lat?: number;

  //montant?: number;
  hauteur?: number;
  altitude?: number;
  nbrPiece?: number;
  nbrParking?: number;
  salleEau?: number;
  nbrNiveau?: number;
  jardin?: boolean;
  piscine?: boolean;
  superficie?: boolean;

  owner: string;
  ownerContact: string;
  ownerEmail: string;

  tenant: string;
  tenantContact: string;
  tenantEmail: string;

  houseCo?: HouseCo;
  syndic?: Syndic;
  agency?: any;

  photo?: string;
  photoUuid?: string;
  photoSrc?: string;
  folderUuid?: string;
  folder?: FolderFiles;
  etat?: string;

  createdAt?: string;
  updatedAt?: string;
  create?: string;
  update?: string;
}
