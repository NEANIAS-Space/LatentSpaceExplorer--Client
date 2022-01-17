import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';
import theme from 'styles/theme';

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const BarGraph = () => {
    const { barGraphData } = useContext(ProjectorContext);

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

    return (
        <DynamicGraph
            data={barGraphData}
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
