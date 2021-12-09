import { getReduction } from 'app/api/reduction';
import { getCluster } from 'app/api/cluster';
import graphManager from 'app/utils/graphManager';

const getVisualization = async (
    userId,
    experimentId,
    reductionId,
    clusterId,
) => {
    const [reductionResult, clusterResult] = await Promise.all([
        getReduction(userId, experimentId, reductionId),
        getCluster(userId, experimentId, clusterId),
    ]);

    const components = reductionResult.metadata.components;
    const points = reductionResult.reduction;
    const labels = reductionResult.labels;
    const clusters = clusterResult.cluster;

    const graphData = graphManager(components, points, labels, clusters);

    return graphData;
};

export default getVisualization;
