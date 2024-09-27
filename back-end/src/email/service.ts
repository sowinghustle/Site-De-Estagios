import nodemailer from 'nodemailer';
import { User } from '../user/model';
import config from '../config/index'; 

type Result<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.project.emailOptions.host,
            port: config.project.emailOptions.port,
            auth: {
                user: config.project.emailOptions.auth.user, // Corrigido
                pass: config.project.emailOptions.auth.pass, // Corrigido
            },
        });
    }

    async sendNewUserEmail(email: string): Promise<Result<void>> {
        try {
            await this.transporter.sendMail({
                from: config.project.emailOptions.auth.user,
                to: email,
                subject: 'Bem-vindo!',
                text: 'Sua conta foi criada com sucesso!',
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Falha ao enviar email de boas-vindas.' };
        }
    }
    async sendResetPasswordEmail(email: string): Promise<Result<void>> {
        try {
            await this.transporter.sendMail({
                from: config.project.emailOptions.auth.user,
                to: email,
                subject: 'Redefinição de Senha',
                text: 'Clique aqui para redefinir sua senha.',
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Falha ao enviar email de redefinição de senha.' };
        }
    }

}

const emailService = new EmailService();
export default emailService;
