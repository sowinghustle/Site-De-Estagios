import nodemailer from 'nodemailer';
import { User } from '../user/model';
import config from '../config/index'; 
import { buildToResult } from '../config/utils';

class FakeEmailService {
    private logger: (msg: string) => Promise<void>;

    constructor(logger: (msg: string) => Promise<void>) {
        this.logger = logger;
    }

    async sendNewUserEmail(email: string) {
        const toResult = buildToResult<void>();
        
        try {
            await this.logger(`Email de bem-vindo enviado para ${email}`);
            return toResult(); // Sucesso
        } catch (error: any) {
            return toResult(error);
        }
    }

    async sendResetPasswordEmail(email: string) {
        const toResult = buildToResult<void>();
        
        try {
            await this.logger(`Enviado o link de redefinição de senha para ${email}`);
            return toResult(); // Sucesso
        } catch (error: any) {
            return toResult(error);
        }
    }
}

export default FakeEmailService;
