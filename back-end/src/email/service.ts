import nodemailer from 'nodemailer';
import { User } from '../user/model';
import config from '../config/index'; 



class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.project.emailOptions.host,
            port: config.project.emailOptions.port,
            auth: {
                user: config.project.emailOptions.user,
                pass: config.project.emailOptions.pass,
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
  
        } catch (error) {
  
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

        } catch (error) {
            
        }
    }

}

const emailService = new EmailService();
export default emailService;
