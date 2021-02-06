import { MESSAGES } from './../config/constants';
import { Db } from 'mongodb';
import { IVariables } from './../interfaces/variables.interface';
import { IContextData } from './../interfaces/contex.interface';
import { findElements, findOneElmenet, insertOneElement, updateOneElement, deleteOneElement } from './../lib/db-operations';
import { pagination } from '../lib/pagination';
class ResolversOperationsService {
    private root: object;
    private variables: IVariables;
    private context: IContextData;
    constructor(root: object, variables: object, context: IContextData) {
        this.root = root;
        this.variables = variables;
        this.context = context;
    }
    protected getVariables(): IVariables { return this.variables };
    protected getDb(): Db { return this.context.db! };
    protected getContext(): IContextData { return this.context };

    protected async list(collection: string, ListElement: string, page: number = 1, itemsPage: number = 20, filter: object = { active: {$ne: false}}) {
        try {
            const paginationData = await pagination(this.getDb(), collection, page, itemsPage);
            
            return {
                info: {
                    page: paginationData.page,
                    pages: paginationData.pages,
                    itemsPage: paginationData.itemsPage,
                    total: paginationData.total
                },
                status: true,
                message: `List ${ListElement} loaded`,
                items: await findElements(this.getDb(), collection, filter, paginationData)
            }
        } catch (error) {
            return {
                info: null,
                status: false,
                message: `ERROR: List ${ListElement}`,
                items: null
            }  
        }
    }

    protected async getItem(collection: string) {
        try {
            return {
                status: true,
                message: `Item ${this.variables.id} from ${collection} loaded`,
                item: await findOneElmenet(this.getDb(), collection, { id: this.variables.id })
            }
        } catch (error) {
            return {
                status: false,
                message: `${collection} ${this.variables.id} NOT FOUND`,
                item: null
            }
        }
    }

    protected async addItem(collection: string, document: object, item: string) {
        try {
            return await insertOneElement(this.getDb(), collection, document)
                .then((res) => {
                    if (res.result.ok === 1) {
                       return {
                        status: true,
                        message: `OK inserting ${item}`,
                        item: document
                       }
                    }
                    return {
                        status: false,
                        message: `Error inserting ${item}`,
                        item: null
                    }
                })
        } catch (error) {
            return {
                status: false,
                message: `Error inserting ${item}`,
                item: null
            };
        }
    }

    protected async update(collection: string, filter: object, objectUpdate: object){
        try {
            return await updateOneElement(this.getDb(), collection, filter, objectUpdate)
                .then((res) => {
                    if(res.result.nModified === 1 && res.result.ok ){
                        return {
                            status: true,
                            message: `${collection} - ${MESSAGES.GENERAL.UPDATE_SUCESS}`,
                            item: Object.assign({}, filter, objectUpdate)
                        };
                    }
                    return {
                        status: false,
                        message: MESSAGES.GENERAL.UPDATE_ERROR,
                        item: null
                    };
                })
        } catch (error) {
            return {
                status: false,
                message: `${MESSAGES.GENERAL.UPDATE_ERROR} - ${error}`,
                item: null
            };
        }
    }

    protected async remove(collection: string, filter: object, item: string){
        try {
            return await deleteOneElement(this.getDb(), collection, filter).then(
                (res) => {
                    if (res.deletedCount ===1 ){
                        return{
                            status: true,
                            message: `Item ${item} removed`
                        };
                    }
                    return {
                        status: false,
                        message: `Item ${item} NOT removed`
                    };
                });
        } catch (error) {
            return {
                status: false,
                message: `BACKEND: Error, ${error}`
            };
        }
    }
}

export default ResolversOperationsService;