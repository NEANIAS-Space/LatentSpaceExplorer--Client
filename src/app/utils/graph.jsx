const GraphManager = (components, points, ids, traces) => {
    const is3D = components === 3;

    const trace = {
        x: [],
        y: [],
        ...(is3D && { z: [] }),
        text: [],
        type: is3D ? 'scatter3d' : 'scatter',
        mode: 'markers',
        marker: {
            line: {
                color: 'rgb(0, 0, 0)',
                width: 1,
            },
        },
    };

    const graphData = Array.from([...new Set(traces)]).fill(trace);

    for (let i = 0; i < points.length; i += 1) {
        graphData[traces[i]] = {
            ...graphData[traces[i]],
            x: [...graphData[traces[i]].x, points[i][0]],
            y: [...graphData[traces[i]].y, points[i][1]],
            ...(is3D && {
                z: [...graphData[traces[i]].z, points[i][2]],
            }),
            text: [...graphData[traces[i]].text, ids[i]],
        };
    }

    return graphData;
};

export default GraphManager;
