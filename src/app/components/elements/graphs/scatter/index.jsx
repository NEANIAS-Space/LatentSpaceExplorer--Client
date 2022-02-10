import { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const ScatterGraphManager = (components, points, ids, traces) => {
    if (!(points.length > 0 && ids.length > 0 && traces.length > 0)) {
        return [];
    }

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
        name: '',
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
            ...(traces[i] === -1 && {
                marker: { color: 'rgba(0, 0, 0, 0.75)' },
            }),
            name: traces[i],
        };
    }

    return graphData;
};

const ScatterGraph = () => {
    const { components } = useContext(ProjectorContext);
    const { points } = useContext(ProjectorContext);
    const { ids } = useContext(ProjectorContext);
    const { groups } = useContext(ProjectorContext);
    const { setPreviewImage } = useContext(ProjectorContext);

    const [data, setData] = useState([]);

    const [layout, setLayout] = useState({
        hovermode: 'closest',
    });

    const [config, setConfig] = useState(undefined);

    const handlePointClick = (d) => {
        const imageName = d.points[0].text;
        setPreviewImage(`${imageName}`);
    };

    useEffect(() => {
        setData(ScatterGraphManager(components, points, ids, groups));
    }, [components, ids, points, groups]);

    return (
        <DynamicGraph
            data={data}
            layout={layout}
            config={config}
            onUpdate={(figure) => {
                setLayout(figure.layout);
                setConfig(figure.config);
            }}
            onClick={handlePointClick}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
        />
    );
};

export default ScatterGraph;
