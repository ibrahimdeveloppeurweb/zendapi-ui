import { Quote } from "@model/quote";
import { Construction } from "@model/construction";

export interface Production {
    uuid?: any;
    id?: any;
    code?: string;
    etat?: string;
    construction?: Construction;
    quotes?: Quote[];
    options?: [];
    optionProductions?: any[];
    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
}
