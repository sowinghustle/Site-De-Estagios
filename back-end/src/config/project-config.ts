type Environment = 'development' | 'test' | 'production';

const isRunningTsNodeDev = !!process.env.TS_NODE_DEV;

const environment = (
    isRunningTsNodeDev ? 'development' : process.env.environment || 'production'
) as Environment;

const port = process.env.PORT || 8000;

export default {
    environment,
    port,
};
