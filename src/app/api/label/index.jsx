import api from 'app/api';

const getLabels = async (userId, experimentId) => {
    const labels = await api(userId).get(`/experiments/${experimentId}/labels`);

    return labels;
};

export { getLabels };
