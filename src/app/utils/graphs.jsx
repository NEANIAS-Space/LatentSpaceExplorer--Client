import { range, occurrences } from 'app/utils/maths';

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
        };
    }

    return graphData;
};

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

const BarGraphManager = (traces) => {
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
    };

    const graphData = Array.from(symbols).fill(trace);

    symbols.forEach((symbol, id) => {
        graphData[id] = {
            ...graphData[id],
            x: [occurrences(traces, symbol)],
            y: [symbol],
        };
    });

    return graphData;
};

export { ScatterGraphManager, SilohouetteGraphManager, BarGraphManager };
