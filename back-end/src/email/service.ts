import nodemailer from 'nodemailer';
import { User } from '../user/model';
import config from '../config/index'; 
import { buildToResult } from '../config/utils';

class NodeMailerService {
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

    async sendNewUserEmail(email: string) {
        const toResult = buildToResult<void>();
        
        try {
            await this.transporter.sendMail({
                from: config.project.emailOptions.auth.user,
                to: email,
                subject: 'Bem-vindo!',
                text: 'Sua conta foi criada com sucesso!',
            });
            return toResult(); // Sucesso
        } catch (error: any) {
            return toResult(error)
        }
    }

    async sendResetPasswordEmail(email: string) {
        const toResult = buildToResult<void>();
        
        try {
            await this.transporter.sendMail({
                from: config.project.emailOptions.auth.user,
                to: email,
                subject: 'Redefinição de Senha',
                text: 'Clique aqui para redefinir sua senha.',
            });
            return toResult(); // Sucesso
        } catch (error: any) {
            return toResult(error)
        }
    }
}

const emailService = new EmailService();
export default NodeMailerService;
