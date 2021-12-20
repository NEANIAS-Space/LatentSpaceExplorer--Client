import { createContext } from 'react';

const ProjectorContext = createContext({
    openMessageBox: false,
    setOpenMessageBox: () => {},
    errorMessage: '',
    setErrorMessage: () => {},
    updateReductions: true,
    setUpdateReductions: () => {},
    graphData: [],
    setGraphData: () => {},
});

export default ProjectorContext;
