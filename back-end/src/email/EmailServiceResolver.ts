import nodemailer from 'nodemailer';
import { User } from '../user/model';
import config from '../config/index'; 
import { buildToResult } from '../config/utils';
import { EmailService } from './EmailService'; 
import  FakeEmailService  from './FakeEmailService'; 
import  NodeMailerService  from './service'; 

class EmailServiceResolver {
    async getEmailService(): Promise<EmailService> {
        if (process.env.NODE_ENV === 'production') {
            return new NodeMailerService();
        } else {
            return new FakeEmailService(console.log);
        }
    }
}
