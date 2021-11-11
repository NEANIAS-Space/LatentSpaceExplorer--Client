import { createContext } from 'react';

const ProjectorContext = createContext({
    graphData: [],
    setGraphData: () => {},
    previewImage: '',
    setPreviewImage: () => {},
    previewImageIsLocked: false,
    setPreviewImageIsLocked: () => {},
});

export default ProjectorContext;
