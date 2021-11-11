import api from 'app/api';

const getReductions = async (userId, experimentId) => {
    const reductions = await api(userId).get(
        `/experiments/${experimentId}/reductions`,
    );

    return reductions;
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

export { postReduction, getReductions, getReduction };
