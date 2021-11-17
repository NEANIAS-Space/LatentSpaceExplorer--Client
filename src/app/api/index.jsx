import axios from 'axios';

const api = (userId) => {
    const args = {
        baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId,
        },
    };

    const instance = axios.create(args);

    instance.interceptors.response.use(
        (response) => response.data,
        (error) => error,
    );

    return instance;
};

export default api;
