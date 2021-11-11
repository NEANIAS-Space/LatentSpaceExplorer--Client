import api from 'app/api';

const getClusters = async (userId, experimentId) => {
    const clusters = await api(userId).get(
        `/experiments/${experimentId}/clusters`,
    );

    return clusters;
};

const getCluster = async (userId, experimentId, clusterId) => {
    const cluster = await api(userId).get(
        `/experiments/${experimentId}/clusters/${clusterId}`,
    );

    return cluster;
};

const postCluster = async (userId, experimentId, algorithm, params) => {
    const payload = {
        algorithm,
        params,
    };

    const task = await api(userId).post(
        `/experiments/${experimentId}/clusters`,
        payload,
    );

    return task;
};

export { getClusters, getCluster, postCluster };
