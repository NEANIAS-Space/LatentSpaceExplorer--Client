import axios from 'axios';
import getConfig from 'next/config';

const {
    publicRuntimeConfig: { processEnv },
} = getConfig();


const api = (userId) => {
    const { NEXT_PUBLIC_SERVER_URL } = processEnv;

    const url = process.browser
        ? '/server'
        : NEXT_PUBLIC_SERVER_URL;

    const args = {
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId,
        },
    };

    const instance = axios.create(args);

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (!error.response.data.message) {
                switch (error.response.status) {
                    case 500:
                        // eslint-disable-next-line no-param-reassign
                        error.response.data = {
                            message: 'Generic server error',
                        };
                        break;

                    case 502:
                        // eslint-disable-next-line no-param-reassign
                        error.response.data = {
                            message: 'Server not available',
                        };
                        break;

                    case 504:
                        // eslint-disable-next-line no-param-reassign
                        error.response.data = {
                            message: 'Request has expired',
                        };
                        break;

                    default:
                        break;
                }
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

export default api;
