import { useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';
import theme from 'styles/theme';
import { range, average } from 'app/utils/maths';

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const SilhouetteGraphManager = (silhouettes, traces) => {
    if (!(silhouettes.length > 0 && traces.length > 0)) {
        return [];
    }

    let symbols = [...new Set(traces)];
    // filter noisy points
    symbols = symbols.filter((symbol) => symbol !== -1);

    const symbolsMap = new Map();
    symbols.forEach((symbol, index) => {
        symbolsMap.set(symbol, index);
    });

    const trace = {
        fill: 'tozerox',
        line: { width: 0.5 },
        mode: 'lines',
        type: 'scatter',
        x: [],
        y: [],
        hovertemplate: '%{x}',
        name: '',
    };

    const graphData = Array.from(symbols).fill(trace);

    for (let i = 0; i < silhouettes.length; i += 1) {
        if (traces[i] !== -1) {
            const symbolId = symbolsMap.get(traces[i]);

            graphData[symbolId] = {
                ...graphData[symbolId],
                x: [...graphData[symbolId].x, silhouettes[i]],
                name: traces[i],
            };
        }
    }

    let start = 0;
    graphData.forEach((_, index) => {
        graphData[index].x = graphData[index].x.sort();
        const stop = start + graphData[index].x.length;
        graphData[index].y = range(start, stop, 1);
        start = stop + 1;
    });

    return graphData;
};

const computeAverageLine = (silhouetteGraphData) => {
    let x = [];
    let y = [];

    silhouetteGraphData.forEach((trace) => {
        x = x.concat(trace.x);
        y = x.concat(trace.y);
    });

    const avg = average(x);
    const max = Math.max(...y);

    return { avg, max };
};

const SilhouetteGraph = () => {
    const { groups } = useContext(ProjectorContext);
    const { silhouettes } = useContext(ProjectorContext);

    const [data, setData] = useState([]);
    const [layout, setLayout] = useState();
    const [config, setConfig] = useState({
        displayModeBar: false,
    });

    useEffect(() => {
        setData(SilhouetteGraphManager(silhouettes, groups));
    }, [silhouettes, groups]);

    useEffect(() => {
        const averageLine = computeAverageLine(data);

        setLayout({
            showlegend: false,
            hovermode: 'closest',
            margin: {
                l: theme.spacing(0),
                r: theme.spacing(0),
                b: theme.spacing(2),
                t: theme.spacing(0),
            },
            yaxis: {
                visible: false,
            },
            xaxis: {
                showspikes: true,
                spikemode: 'across',
                spikethickness: 2,
                spikedash: 'dot',
            },
            shapes: [
                {
                    type: 'line',
                    xref: 'x',
                    yref: 'y',
                    x0: averageLine.avg,
                    y0: 0,
                    x1: averageLine.avg,
                    y1: averageLine.max,
                    line: {
                        color: 'red',
                        width: 2,
                        dash: 'dot',
                    },
                },
            ],
        });
    }, [data]);

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

export default SilhouetteGraph;
