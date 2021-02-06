import { IResolvers } from "graphql-tools";
import UserService from '../../services/user.service';


const resolversUserQuery: IResolvers = {
    Query:{
        async users(_, variables, context) {
            return new UserService(_, { pagination: variables }, context).items();
        },

        async login(_, args, context) {
            const email = args.email || null
            const password = args.password || null
            return new UserService(_, { user: { email, password }}, context).login();
        },

        async me(_, __, context) {
            return new UserService(_, __, context).auth();
        }
    }
};

export default resolversUserQuery;