import bcrypt from 'bcrypt';

class HashService {
    async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePassword(
        plainPassword: string,
        encryptedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(plainPassword, encryptedPassword);
    }
}

const hashService = new HashService();

export default hashService;
