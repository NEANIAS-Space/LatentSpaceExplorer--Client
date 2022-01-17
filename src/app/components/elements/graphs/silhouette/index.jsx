import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';
import theme from 'styles/theme';
import { average } from 'app/utils/maths';

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const SilhouetteGraph = () => {
    const { silhouetteGraphData } = useContext(ProjectorContext);

    let x = [];
    let y = [];

    silhouetteGraphData.forEach((trace) => {
        x = x.concat(trace.x);
        y = x.concat(trace.y);
    });

    const avg = average(x);
    const max = Math.max(...y);

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
        shapes: [
            {
                type: 'line',
                xref: 'x',
                yref: 'y',
                x0: avg,
                y0: 0,
                x1: avg,
                y1: max,
                line: {
                    color: 'red',
                    width: 2,
                    dash: 'dot',
                },
            },
        ],
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

export default SilhouetteGraph;
