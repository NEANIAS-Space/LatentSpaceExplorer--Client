/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */

const injectDevServer = require('@cypress/react/plugins/next');

module.exports = (on, config) => {
    injectDevServer(on, config);

    config.env.SERVER_HOST = process.env.SERVER_SERVICE_HOST;
    config.env.SERVER_PORT = process.env.SERVER_SERVICE_PORT;

    return config;
};
