import { countElements } from './db-operations';
import { PAGINATION_LIMIT } from './../config/constants';
import { Db } from 'mongodb';
export async function pagination(db: Db, collection: string, page: number = 1, itemsPage: number = 20, filter: object = {}) {
    if(itemsPage < 1 || itemsPage > PAGINATION_LIMIT) {
        itemsPage = 50;
    }
    if (page < 1) {
        page = 1;
    }
    const total = await countElements(db, collection, filter);
    const pages = Math.ceil(total/itemsPage);
    return {
        page,
        skip: (page - 1) * itemsPage,
        itemsPage,
        total,
        pages
    };
}