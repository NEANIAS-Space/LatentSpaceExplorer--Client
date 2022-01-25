import { createContext } from 'react';

const ProjectorContext = createContext({
    openMessageBox: false,
    setOpenMessageBox: () => {},
    errorMessage: '',
    setErrorMessage: () => {},
    updateReductions: true,
    setUpdateReductions: () => {},
    updateClusters: true,
    setUpdateClusters: () => {},
    scatterGraphData: [],
    setScatterGraphData: () => {},
    silhouetteGraphData: [],
    setSilhouetteGraphData: () => {},
    barGraphData: [],
    setBarGraphData: () => {},
    clustersScores: {},
    setClustersScores: () => {},
    previewImage: '',
    setPreviewImage: () => {},
});

export default ProjectorContext;
