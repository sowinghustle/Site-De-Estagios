import nodemailer from 'nodemailer';
import config from '../config/index'; 
import { buildToResult, Result } from '../config/utils';
import EmailService from './EmailService';


class NodeMailerService implements EmailService {
    static sendNewUserEmail(email: string) {
        throw new Error('Method not implemented.');
    }
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.project.emailOptions.host,
            port: config.project.emailOptions.port,
            auth: {
                user: config.project.emailOptions.auth.user,
                pass: config.project.emailOptions.auth.pass,
            },
        });
    }

    async sendNewUserEmail(email: string): Promise<{ success: boolean }> {
        const toResult = buildToResult<void>();
        
        try {
            await this.transporter.sendMail({
                from: config.project.emailOptions.auth.user,
                to: email,
                subject: 'Bem-vindo!',
                text: 'Sua conta foi criada com sucesso!',
            });
            return { success: true };
        } catch (error: any) {
            return { success: false };
        }
    }

    async sendResetPasswordEmail(email: string): Promise<Result<void>> {
        const toResult = buildToResult<void>();
        
        try {
            await this.transporter.sendMail({
                from: config.project.emailOptions.auth.user,
                to: email,
                subject: 'Redefinição de Senha',
                text: 'Clique aqui para redefinir sua senha.',
            });
            return toResult(); 
        } catch (error: any) {
            return toResult(error); 
        }
    }
}

const nodeMailerService = new NodeMailerService();
export default NodeMailerService;
