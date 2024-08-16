import { randomUUID } from 'crypto';

class TokenService {
    generateUserToken(): string {
        return randomUUID();
    }
}

const tokenService = new TokenService();

export default tokenService;
