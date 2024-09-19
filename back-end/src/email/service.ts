import nodemailer from 'nodemailer';
import { User } from '../user/model'; 

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '6c0d90943fb7b6', 
                pass: '5de85912b951c6', 
            },
        });
    }

    async sendNewUserEmail(user: User) {
        const mailOptions = {
            from: '"Seu Site" <from@example.com>',
            to: user.email,
            subject: 'Bem-vindo ao Seu Site!',
            text: `Olá ${user.email},\n\nObrigado por se cadastrar em nosso site! Estamos felizes em tê-lo conosco.\n\nAtenciosamente,\nSua Equipe`,
            html: `
                <p>Olá <strong>${user.email}</strong>,</p>
                <p>Obrigado por se cadastrar em nosso site! Estamos felizes em tê-lo conosco.</p>
                <p>Atenciosamente,<br/>Sua Equipe</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email enviado com sucesso para:', user.email);
        } catch (error) {
            console.error('Erro ao enviar email:', error);
        }
    }

    async sendResetPasswordEmail(user: User) {
        const mailOptions = {
            from: '"Seu Site" <from@example.com>',
            to: user.email,
            subject: 'Redefinição de Senha',
            text: `Olá ${user.email},\n\nRecebemos um pedido para redefinir sua senha. Clique no link abaixo para criar uma nova senha:\n\n[Link para redefinir a senha]\n\nSe você não solicitou essa redefinição, pode ignorar este email.\n\nAtenciosamente,\nSua Equipe`,
            html: `
                <p>Olá <strong>${user.email}</strong>,</p>
                <p>Recebemos um pedido para redefinir sua senha. Clique no link abaixo para criar uma nova senha:</p>
                <p><a href="[Link para redefinir a senha]">Redefinir Senha</a></p>
                <p>Se você não solicitou essa redefinição, pode ignorar este email.</p>
                <p>Atenciosamente,<br/>Sua Equipe</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email de redefinição de senha enviado para:', user.email);
        } catch (error) {
            console.error('Erro ao enviar email de redefinição de senha:', error);
        }
    }
}

const emailService = new EmailService();
export default emailService;
