import { IPaginationOptions } from './../interfaces/pagination-options.interface';
import { Db } from 'mongodb';
import Database from './database';


/**
 * 
 * @param database Database we are working with
 * @param collection Collection we are checking the last element
 * @param sort Ordering criterai { <property> : -1}
 */
export const assignDocumentId = async(
    database: Db,
    collection: string,
    sort: object = { registerDate: -1}
) => {
    const lastElement = await database
        .collection(collection)
        .find()
        .limit(1)
        .sort(sort)
        .toArray();

    if(lastElement.length === 0) {
        return '1';
    }
    return String (+lastElement[0].id + 1);
};

/**
 * 
 * @param database Database we are working with
 * @param collection Collection we are checking the last element
 * @param filter Ordering criterai { <property> : -1}
 */
export const findOneElmenet = async (
    database: Db,
    collection: string,
    filter: object
) => {
    return database
        .collection(collection)
        .findOne(filter)
};

/**
 * 
 * @param database Database we are working with
 * @param collection Collection we are checking the last element
 * @param document Single Object we are adding { object }
 */
export const insertOneElement = async(
    database: Db,
    collection: string,
    document: object
) => {
    return await database
        .collection(collection)
        .insertOne(document)
};

/**
 * 
 * @param database Database we are working with
 * @param collection Collection we are checking the last element
 * @param documents Array of Objects we are adding [{ object }]
 */
export const insertOneManyElement = async(
    database: Db,
    collection: string,
    documents: Array<object>
) => {
    return await database
        .collection(collection)
        .insertMany(documents)
};

/**
 * 
 * @param database Database we are working with
 * @param collection Collection we are checking the last element
 * @param filter Identificator of an UNIQUE element in database
 * @param document Document we want to update.
 */
export const updateOneElement = async(
    database: Db,
    collection: string,
    filter: object,
    document: object
) => {
    return await database
        .collection(collection)
        .updateOne(filter, { $set: document} );
};

/**
 * 
 * @param database Database we are working with
 * @param collection Collection we are checking the last element
 * @param filter Identificator of an UNIQUE element in database
 * @param document Document we want to update.
 */
export const deleteOneElement = async(
    database: Db,
    collection: string,
    filter: object
) => {
    return await database
        .collection(collection)
        .deleteOne(filter);
};

/**
 * 
 * @param database Database we are working with
 * @param collection Collection we are checking the last element
 * @param filter Object searching
 */
export const findElements = async(
    database: Db,
    collection: string,
    filter: object = {},
    paginationOptions: IPaginationOptions = {
        page: 1,
        pages: 1,
        itemsPage: 20,
        skip: 0,
        total: -1
    }
) => {
    if (paginationOptions.total === 1) {
        return await database.collection(collection).find(filter).toArray();
    }
 
    const result = await database.collection(collection)
        .find(filter)
        .limit(paginationOptions.itemsPage)
        .skip(paginationOptions.skip)
        .toArray();
    
    return result;
};

export const countElements = async(
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database.collection(collection).countDocuments(filter);
};

export const randomItems = async(
    database: Db,
    collection: string,
    filter: object = {},
    items: number = 10
): Promise<Array<object>> => {
    return new Promise(async(resolve) => {
        const pipeline = [
            { $match: filter },
            { $sample: { size: items } }
        ];
        resolve(await database.collection(collection).aggregate(
            pipeline
        ).toArray());
    });
};
