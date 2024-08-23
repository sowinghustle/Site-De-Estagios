import { randomUUID } from 'crypto';

export default Object.freeze({
    adminName: 'admin',
    adminEmail: 'admin@email.com',
    adminPassword: randomUUID(),
});
