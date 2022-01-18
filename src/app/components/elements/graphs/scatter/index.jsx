import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';

const ScatterGraphManager = (components, points, ids, traces) => {
    const is3D = components === 3;

    const symbols = [...new Set(traces)];

    const symbolsMap = new Map();
    symbols.forEach((symbol, index) => {
        symbolsMap.set(symbol, index);
    });

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
        hovertemplate: '%{text}',
    };

    const graphData = Array.from(symbols).fill(trace);

    for (let i = 0; i < points.length; i += 1) {
        const symbolId = symbolsMap.get(traces[i]);

        graphData[symbolId] = {
            ...graphData[symbolId],
            x: [...graphData[symbolId].x, points[i][0]],
            y: [...graphData[symbolId].y, points[i][1]],
            ...(is3D && {
                z: [...graphData[symbolId].z, points[i][2]],
            }),
            text: [...graphData[symbolId].text, ids[i]],
            // noisy points
            ...(traces[i] === -1 && { marker: { color: 'rgb(0, 0, 0)' } }),
        };
    }

    return graphData;
};

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const ScatterGraph = () => {
    const { scatterGraphData } = useContext(ProjectorContext);
    const { setPreviewImage } = useContext(ProjectorContext);

    const [layout, setLayout] = useState({
        hovermode: 'closest',
    });
    const [frames, setFrames] = useState(undefined);
    const [config, setConfig] = useState(undefined);

    const handlePointClick = (data) => {
        const imageName = data.points[0].text;
        setPreviewImage(`${imageName}`);
    };

    return (
        <DynamicGraph
            data={scatterGraphData}
            layout={layout}
            frames={frames}
            config={config}
            onUpdate={(figure) => {
                setLayout(figure.layout);
                setFrames(figure.frames);
                setConfig(figure.config);
            }}
            onClick={handlePointClick}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
        />
    );
};

export { ScatterGraphManager, ScatterGraph };
