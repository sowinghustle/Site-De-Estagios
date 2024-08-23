import { randomUUID } from 'crypto';

const config = buildConfig();

function buildConfig() {
    type Environment = 'development' | 'test' | 'production';

    var environment: Environment = 'production';

    const port = process.env.PORT || 8000;
    const isRunningTsNodeDev = !!process.env.TS_NODE_DEV;
    const isTesting = process.env.NODE_ENV == 'test';
    const secret = process.env.secret || randomUUID();

    if (isRunningTsNodeDev) environment = 'development';
    if (isTesting) environment = 'test';

    return {
        environment,
        port,
        secret,
    };
}

export default Object.freeze(config);
