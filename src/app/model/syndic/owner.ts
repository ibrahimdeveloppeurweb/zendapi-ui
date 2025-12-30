import { Folder } from "../folder";
import { HomeCo } from "./home-co";
import { HouseCo } from "./house-co";

export interface Owner {
    uuid?: any;
    id?: any;

    nom?: string;
    civilite?: string;
    sexe?: string;
    dateN?: string;
    lieuN?: string;
    domicile?: string;
    nationalite?: string;
    situationMatrimoniale?: string;
    enfant?: string;
    profession?: string;
    naturePiece?: string;
    autrePiece?: string;
    numPiece?: string;
    signatureAutorite?: string;
    dateEmission?: string;
    dateExpirePiece?: string;
    nomUrgence?: string;
    affiniteUrgence?: string;
    autreAffinite?: string;
    contactUrgence?: string;
    ncc?: string;
    nrc?: string;
    capital?: string;
    siegeSocial?: string;
    posteOccupe?: string;
    nomResponsable?: string;
    telResponsable?: string;
    type?: string;
    telephone?: string;
    codePostal?: string;
    autorisationNotif?: string;
    homesCo?: HomeCo[];
    housesCo?: HouseCo[];

    superficie?: number;
    folderUuid?: string;
    folder?: string;
    etat?: string;

    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
}
