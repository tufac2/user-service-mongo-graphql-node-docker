import { IJwt } from '../interfaces/jwt.interface';
import { SECRET_KEY, MESSAGES, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';


class JWT {
    private secretKey = SECRET_KEY as string;

    sign(data: IJwt) {
        return jwt.sign(
            { user: data.user },
            this.secretKey,
            { expiresIn: EXPIRETIME.D3}
        );
    }

    verify(token: string) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return MESSAGES.TOKEN.VERIFICATION_FAILED
        }
    };
}

export default JWT;