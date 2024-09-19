import { DatabaseResolver } from './database';
import project from './config/project';
import app from './app';
import EmailService from './email/service';
import { UserRole } from './user/model';

app.listen(project.port, async () => {
    await DatabaseResolver.getConnection();
    console.log('Server running at port ' + project.port);
});

