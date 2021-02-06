import { IPaginationOptions } from './pagination-options.interface';
import { IProduct } from './product.interface';
import { IUser } from './user.interfaces';
export interface IVariables {
    id?: string | number;
    category?: string;
    platform?: string;
    product?: IProduct;
    user?: IUser;
    pagination?: IPaginationOptions;
}