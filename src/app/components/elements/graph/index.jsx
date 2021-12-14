import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector';

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const Graph = () => {
    const { graphData } = useContext(ProjectorContext);
    const { setPreviewImage } = useContext(ProjectorContext);

    const [layout, setLayout] = useState({
        hovermode: 'closest',
    });
    const [frames, setFrames] = useState(undefined);
    const [config, setConfig] = useState(undefined);

    const handlePointHover = (data) => {
        const imageName = data.points[0].text;
        setPreviewImage(`${imageName}`);
    };

    return (
        <DynamicGraph
            data={graphData}
            layout={layout}
            frames={frames}
            config={config}
            onUpdate={(figure) => {
                setLayout(figure.layout);
                setFrames(figure.frames);
                setConfig(figure.config);
            }}
            onHover={handlePointHover}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
        />
    );
};

export default Graph;
