import app from './app';
import project from './config/project';
import { DatabaseResolver } from './database';

app.listen(project.port, async () => {
    await DatabaseResolver.getConnection();
    console.log('Server running at port ' + project.port);
});
