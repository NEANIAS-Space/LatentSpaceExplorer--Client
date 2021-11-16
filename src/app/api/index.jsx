import axios from 'axios';

const api = (userId) => {
    console.log(process.env);

    const args = {
        baseURL: '/server',
        headers: {
            'Content-Type': 'application/json',
            'user-id': userId,
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
