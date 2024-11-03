import adminService from './admin/service';
import app from './app';
import config from './config';
import { toPromiseResult } from './config/utils';

app.listen(config.project.port, async () => {
    if (config.project.environment === 'development') {
        await toPromiseResult(
            adminService.saveNewAdmin({
                name: config.instituition.adminName,
                user: {
                    email: config.instituition.adminEmail,
                    password: config.instituition.adminPassword,
                },
            })
        ).orElseThrow();
    }

    console.log('Server running at port ' + config.project.port);
});
