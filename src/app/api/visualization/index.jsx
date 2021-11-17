import { getReduction } from 'app/api/reduction';
import { getCluster } from 'app/api/cluster';

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

    const points = reductionResult.reduction;
    const { labels } = reductionResult;
    const groups = clusterResult.cluster;
    const uniqueGroups = [...new Set(groups)];

    const is3D = reductionResult.metadata.components === 3;

    const trace = {
        x: [],
        y: [],
        ...(is3D && { z: [] }),
        text: [],
        type: is3D ? 'scatter3d' : 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                color: 'rgb(0, 0, 0)',
                width: 1,
            },
        },
    };

    const graphData = Array.from(uniqueGroups).fill(trace);

    for (let i = 0; i < points.length; i += 1) {
        graphData[groups[i]] = {
            ...graphData[groups[i]],
            x: [...graphData[groups[i]].x, points[i][0]],
            y: [...graphData[groups[i]].y, points[i][1]],
            ...(is3D && {
                z: [...graphData[groups[i]].z, points[i][2]],
            }),
            text: [...graphData[groups[i]].text, labels[i].file_name],
        };
    }

    return graphData;
};

export default getVisualization;
