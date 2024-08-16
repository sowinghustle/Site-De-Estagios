import { randomUUID } from 'crypto';

type Environment = 'development' | 'test' | 'production';

const isRunningTsNodeDev = !!process.env.TS_NODE_DEV;
const isTesting = process.env.NODE_ENV == 'env';
const secret = process.env.secret || randomUUID();

let environment: Environment = 'production';

if (isRunningTsNodeDev) environment = 'development';
if (isTesting) environment = 'test';

const port = process.env.PORT || 8000;

export default {
    environment,
    port,
    secret,
};
