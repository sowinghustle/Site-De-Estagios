import { EmailService } from "./EmailService";

interface Result<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class FakeEmailService {
    private logFunction: (msg: string) => Promise<void>;

    constructor(logFunction: (msg: string) => Promise<void>) {
        this.logFunction = logFunction;
    }

    async sendNewUserEmail(email: string): Promise<Result<void>> {
        await this.logFunction(`Enviando email para ${email}`);
        return { success: true };
    }

    async sendResetPasswordEmail(email: string): Promise<Result<void>> {
        await this.logFunction(`Enviando email para ${email}`);
        return { success: true };
    }
}
export default FakeEmailService;