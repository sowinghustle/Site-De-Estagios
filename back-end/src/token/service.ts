import { randomBytes, randomUUID } from 'crypto';

class TokenService {
    generateAccessToken(): string {
        return randomUUID();
    }
    generateResetPasswordToken(): string {
        return randomBytes(32).toString('hex');
    }
}

const tokenService = new TokenService();

export default tokenService;
