import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';
import theme from 'styles/theme';
import { range } from 'app/utils/maths';

const SilohouetteGraphManager = (silhouettes, traces) => {
    const symbols = [...new Set(traces)];

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
    };

    const graphData = Array.from(symbols).fill(trace);

    for (let i = 0; i < silhouettes.length; i += 1) {
        const symbolId = symbolsMap.get(traces[i]);

        graphData[symbolId] = {
            ...graphData[symbolId],
            x: [...graphData[symbolId].x, silhouettes[i]],
            // noisy points
            ...(traces[i] === -1 && { marker: { color: 'rgb(0, 0, 0)' } }),
        };
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

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const SilhouetteGraph = () => {
    const { silhouetteGraphData } = useContext(ProjectorContext);

    // const computeAverageLine = () => {
    //     let x = [];
    //     let y = [];

    //     silhouetteGraphData.forEach((trace) => {
    //         x = x.concat(trace.x);
    //         y = x.concat(trace.y);
    //     });

    //     const avg = average(x);
    //     const max = Math.max(...y);

    //     return { avg, max };
    // };

    // const averageLine = computeAverageLine();

    const [layout, setLayout] = useState({
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
        // shapes: [
        //     {
        //         type: 'line',
        //         xref: 'x',
        //         yref: 'y',
        //         x0: averageLine.avg,
        //         y0: 0,
        //         x1: averageLine.avg,
        //         y1: averageLine.max,
        //         line: {
        //             color: 'red',
        //             width: 2,
        //             dash: 'dot',
        //         },
        //     },
        // ],
    });

    const [config, setConfig] = useState({
        displayModeBar: false,
    });

    return (
        <DynamicGraph
            data={silhouetteGraphData}
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

export { SilohouetteGraphManager, SilhouetteGraph };
