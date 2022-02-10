import { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';
import theme from 'styles/theme';
import { occurrences } from 'app/utils/maths';

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const BarGraphManager = (traces) => {
    if (!(traces.length > 0)) {
        return [];
    }

    const symbols = [...new Set(traces)];

    const symbolsMap = new Map();
    symbols.forEach((symbol, index) => {
        symbolsMap.set(symbol, index);
    });

    const trace = {
        type: 'bar',
        x: [],
        y: [],
        orientation: 'h',
        hovertemplate: '%{x}',
        name: '',
    };

    const graphData = Array.from(symbols).fill(trace);

    symbols.forEach((symbol, id) => {
        graphData[id] = {
            ...graphData[id],
            x: [occurrences(traces, symbol)],
            y: [symbolsMap.get(symbol)],
            // noisy points
            ...(symbol === -1 && { marker: { color: 'rgb(0, 0, 0)' } }),
            name: symbol,
        };
    });

    return graphData;
};

const BarGraph = () => {
    const { groups } = useContext(ProjectorContext);

    const [data, setData] = useState([]);

    const [layout, setLayout] = useState({
        showlegend: false,
        hovermode: 'closest',
        margin: {
            l: theme.spacing(1),
            r: theme.spacing(1),
            b: theme.spacing(2),
            t: theme.spacing(0),
        },
        yaxis: {
            visible: false,
        },
    });

    const [config, setConfig] = useState({
        displayModeBar: false,
    });

    useEffect(() => {
        setData(BarGraphManager(groups));
    }, [groups]);

    return (
        <DynamicGraph
            data={data}
            layout={layout}
            config={config}
            onUpdate={(figure) => {
                setLayout(figure.layout);
                setConfig(figure.config);
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
        />
    );
};

export default BarGraph;
