import api from 'app/api';

const getStatus = async () => {
    const status = await api('none').get(`/status`);

    return status;
};

export default getStatus;
