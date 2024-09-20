import adminService from './admin/service';
import app from './app';
import config from './config';

app.listen(config.project.port, async () => {
    (
        await adminService.saveNewAdmin({
            name: config.instituition.adminName,
            user: {
                email: config.instituition.adminEmail,
                password: config.instituition.adminPassword,
            },
        })
    ).orElseThrow();

    console.log('Server running at port ' + config.project.port);
});
