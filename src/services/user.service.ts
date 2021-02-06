import { findOneElmenet, assignDocumentId, insertOneElement } from './../lib/db-operations';
import { COLLECTIONS, MESSAGES } from './../config/constants';
import { IContextData } from './../interfaces/contex.interface';
import ResolversOperationsService from './resolvers-operations.service';
import slugify from 'slugify';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';


class UserService extends ResolversOperationsService {

    protected collection = COLLECTIONS.USERS;

    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    async items() {
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const result = await this.list(this.collection, 'usuarios', page, itemsPage);
        return {
            info: result.info,
            status: result.status,
            message: result.message,
            users: result.items
        }
    }
    
    async login() {
        try {
            const variables = this.getVariables().user;
            const user = await findOneElmenet(this.getDb(), this.collection, { email: variables?.email });               
            if(user === null) {
                return{
                    status: false,
                    message: MESSAGES.LOGIN.USER_NOT_EXISTS,
                    token: null
                };
            }

            const psw_check = bcrypt.compareSync(variables?.password, user.password);

            if (psw_check != null) {
                delete user.password;
                delete user.birthdate;
                delete user.registerDate;
            }
            return {
                status: psw_check,
                message: !psw_check ? MESSAGES.LOGIN.WRONG_CREDENCIALS : MESSAGES.LOGIN.LOGIN_SUCESS,
                token:
                    !psw_check
                        ? null
                        : new JWT().sign({user}),
                user: !psw_check ? null : user
           };
        } catch (error) {
            return {
                status: false,
                message: {
                    message: MESSAGES.LOGIN.LOGIN_FAIL,
                    error
                },
                token: null
            };
        }
    }

    async auth() {
        let info = new JWT().verify(this.getContext().token!);
        if(info === MESSAGES.TOKEN.VERIFICATION_FAILED) {
            return {
                status: false,
                message: info,
                user: null
            };
        }
        return {
            status: true,
            message: MESSAGES.TOKEN.VERIFICATION_SUCESS,
            user: Object.values(info)[0]
        };
    }

    async register() {
        const user = this.getVariables().user!;

        if (user == null) {
            return {
                status: false,
                message: 'User - Wrong request - User not defined',
                user: null
            };
        }
        if(
            user?.password === null ||
            user?.password === undefined ||
            user?.password === ''
        ) {
            return {
                status: false,
                message: 'User - Wrong request',
                user: null
            };
        }
        const userExists = await findOneElmenet(this.getDb(), this.collection, {email: user.email})

        if (userExists !== null) {
            return {
                status: false,
                message: MESSAGES.REGISTER.USER_ALREADY_EXISTS,
                user: null
            }
        };

        user.id = await assignDocumentId(this.getDb(), COLLECTIONS.USERS, { registerDate: -1})

        user.registerDate = new Date().toISOString();

        user.password = bcrypt.hashSync(user.password, 10);
        const result = await this.addItem(this.collection, user, 'user');
        return {
            status: result.status,
            message: result.message,
            user: result.item
        }

    }

    async modify () {
        const action = 'update';
        const user = this.getVariables().user;
        if (user == null) {
            return {
                status: false,
                message: 'Wrong requests - User not defined',
                user: null
            };
        }

        const userExists = await findOneElmenet(this.getDb(), this.collection, {email: user.email});
        if (userExists === null) {
            return {
                status: false,
                message: `${this.collection} - ${action} - ${MESSAGES.GENERAL.UPDATE_ITEM_NOT_EXISTS}`,
                user: null
            };
        }
        const filter = { id: user.id};
        const result = await this.update(this.collection, filter, user);
        return {
            status: result.status,
            message: result.message,
            user: result.item
        }
    }
}

export default UserService;