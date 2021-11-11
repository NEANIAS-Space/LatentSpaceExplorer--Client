import api from 'app/api';

const getExperiments = async (userId) => {
    const task = await api(userId).get('/experiments');

    return task;
};

const getExperiment = async (userId, experimentId) => {
    const task = await api(userId).get(`/experiments/${experimentId}`);

    return task;
};

const deleteExperiment = async (userId, experimentId) => {
    const task = await api(userId).delete(`/experiments/${experimentId}`);

    return task;
};

export { getExperiments, getExperiment, deleteExperiment };
