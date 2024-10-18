import { Result } from '../config/utils';
import emailService from './service';

export interface EmailService  {
    sendNewUserEmail(email: string): Promise<Result<void>>;
    sendResetPasswordEmail(email: string): Promise<Result<void>>;
}

export default EmailService;