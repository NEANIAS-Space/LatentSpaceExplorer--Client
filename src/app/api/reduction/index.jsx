import api from 'app/api';

const getReductions = async (userId, experimentId) => {
    const reductions = await api(userId).get(
        `/experiments/${experimentId}/reductions`,
    );

    return reductions;
};

const getPendingReductionsCount = async (userId, experimentId) => {
    const result = await api(userId).get(
        `/experiments/${experimentId}/reductions/pending`,
    );

    return result;
};

const getReduction = async (userId, experimentId, reductionId) => {
    const reduction = await api(userId).get(
        `/experiments/${experimentId}/reductions/${reductionId}`,
    );

    return reduction;
};

const postReduction = async (
    userId,
    experimentId,
    algorithm,
    components,
    params,
) => {
    const payload = {
        algorithm,
        components,
        params,
    };

    const task = await api(userId).post(
        `/experiments/${experimentId}/reductions`,
        payload,
    );

    return task;
};

const deleteReduction = async (userId, experimentId, reductionId) => {
    const reduction = await api(userId).delete(
        `/experiments/${experimentId}/reductions/${reductionId}`,
    );

    return reduction;
};

export {
    postReduction,
    getPendingReductionsCount,
    getReductions,
    getReduction,
    deleteReduction,
};
