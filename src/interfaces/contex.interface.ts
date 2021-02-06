import { Db } from 'mongodb';


export interface IContext {
    req: IRequest;
    connection: IConnection;
}

interface IRequest {
    headers: {
        token: string;
    };
}

interface IConnection {
    authorization: string;
}

export interface IContextData {
    db?: Db,
    token?: string;
}