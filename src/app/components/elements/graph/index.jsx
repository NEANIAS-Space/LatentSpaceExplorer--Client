import { useContext, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ProjectorContext from 'app/contexts/projector/context';

const DynamicGraph = dynamic(import('react-plotly.js'), {
    ssr: false,
});

const Graph = () => {
    // projector context

    const { graphData } = useContext(ProjectorContext);
    const { setPreviewImage } = useContext(ProjectorContext);
    const { previewImageIsLocked, setPreviewImageIsLocked } =
        useContext(ProjectorContext);

    // use this variables to keep the state when redraw the graph

    const [layout, setLayout] = useState({
        hovermode: 'closest',
    });
    const [frames, setFrames] = useState(undefined);
    const [config, setConfig] = useState(undefined);

    // preview image logic

    const refPreviewImageIsLocked = useRef(previewImageIsLocked);

    useEffect(() => {
        refPreviewImageIsLocked.current = previewImageIsLocked;
    }, [previewImageIsLocked]);

    const handlePointClick = (data) => {
        const imageName = data.points[0].text;
        setPreviewImage(`${imageName}`);

        setPreviewImageIsLocked(true);
        // refPreviewImageIsLocked.current = true;
    };

    const handlePointHover = (data) => {
        if (!refPreviewImageIsLocked.current) {
            const imageName = data.points[0].text;
            setPreviewImage(`${imageName}`);
        }
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
            onClick={handlePointClick}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
        />
    );
};

export default Graph;
