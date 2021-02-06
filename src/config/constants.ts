import environment from './environments';

if(process.env.NODE_ENV !='production'){
  const env = environment;
}

export const SECRET_KEY = process.env.SECRET || 'back-user-api';

export const PAGINATION_LIMIT = 100;

export enum COLLECTIONS {
  USERS='users'
}

export const MESSAGES = {
  
  TOKEN: {
    VERIFICATION_FAILED: 'Token is not valid',
    VERIFICATION_SUCESS: 'Token valid',
  },

  LOGIN: {
    USER_NOT_EXISTS: "The user does not exists in databas",
    LOGIN_SUCESS: "User Logged in",
    LOGIN_FAIL: "Loggin failed",
    WRONG_CREDENCIALS: "Wrong credentials"
  },

  REGISTER: {
    USER_ALREADY_EXISTS: "user already exists",
    USER_REGISTRED: "User has been registered",
  },

  GENERAL: {
    UPDATE_SUCESS: 'Updated successfully',
    UPDATE_ERROR: 'ERROR Updating item',
    UPDATE_ITEM_NOT_EXISTS: 'Does not exists in Data Base'
  }
}

export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 / 4,
  D3 = H24 * 3
}