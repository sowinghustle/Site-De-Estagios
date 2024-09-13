import app from './app';
import config from './config';
import { DatabaseResolver } from './database';

app.listen(config.project.port, async () => {
    const conn = await DatabaseResolver.getConnection();

    await conn.saveNewAdmin({
        name: config.instituition.adminName,
        user: {
            email: config.instituition.adminEmail,
            password: config.instituition.adminPassword,
        },
    });

    if (conn.getError()) {
        throw conn.getError();
    }

    console.log('Server running at port ' + config.project.port);
});
