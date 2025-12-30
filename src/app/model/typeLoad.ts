import { Category } from "./category";
import { LoadCategory } from "./load-category";
import { Syndic } from "./syndic/syndic";

export interface TypeLoad {
    uuid?: any;
    id?: any;
    code?: string;
    libelle?: string;
    category?: Category;
    createdAt?: string;
    updatedAt?: string;
    create?: string;
    update?: string;
    loadCategory?: LoadCategory,
    budgetV?: number;
    spents?: any;
    searchableTitle?: string;
    searchableDetail?: string;
}
