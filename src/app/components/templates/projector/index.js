import { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import DownloadIcon from '@material-ui/icons/GetApp';
import ProjectorLayout from 'app/components/layouts/projector-layout';
import ProjectorContext from 'app/contexts/projector';
import SideBar from 'app/components/modules/sidebar';
import PrimaryContent from 'app/components/modules/primary-content';
import VisualizationForm from 'app/components/modules/forms/visualization';
import ReductionForm from 'app/components/modules/forms/reduction';
import ClusterForm from 'app/components/modules/forms/cluster';
import MessageBox from 'app/components/elements/message-box';
import ScatterGraph from 'app/components/elements/graphs/scatter';
import SilhouetteGraph from 'app/components/elements/graphs/silhouette';
import BarGraph from 'app/components/elements/graphs/bar';
import PreviewImage from 'app/components/elements/preview-image';
import Widget from 'app/components/modules/widget';

const ProjectorTemplate = () => {
    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [updateReductions, setUpdateReductions] = useState(false);
    const [updateClusters, setUpdateClusters] = useState(false);

    const [scatterGraphData, setScatterGraphData] = useState([]);
    const [silhouetteGraphData, setSilhouetteGraphData] = useState([]);
    const [barGraphData, setBarGraphData] = useState([]);

    const [previewImage, setPreviewImage] = useState('');

    const handleCloseMessageBox = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessageBox(false);
    };

    const renderMessageBox = () => (
        <MessageBox
            message={errorMessage}
            severity="error"
            open={openMessageBox}
            handleClose={handleCloseMessageBox}
        />
    );

    return (
        <ProjectorLayout>
            <ProjectorContext.Provider
                value={{
                    openMessageBox,
                    setOpenMessageBox,
                    errorMessage,
                    setErrorMessage,
                    updateReductions,
                    setUpdateReductions,
                    updateClusters,
                    setUpdateClusters,
                    scatterGraphData,
                    setScatterGraphData,
                    silhouetteGraphData,
                    setSilhouetteGraphData,
                    barGraphData,
                    setBarGraphData,
                    previewImage,
                    setPreviewImage,
                }}
            >
                <SideBar column={1}>
                    <>
                        <VisualizationForm />
                        <ReductionForm />
                        <ClusterForm />
                    </>
                </SideBar>
                <PrimaryContent>
                    <ScatterGraph />
                </PrimaryContent>
                <SideBar column={3}>
                    <>
                        {previewImage && (
                            <PreviewImage imageName={previewImage} />
                        )}
                        {silhouetteGraphData.length > 0 && (
                            <Widget title="Silhouettes">
                                <SilhouetteGraph />
                            </Widget>
                        )}
                        {barGraphData.length > 0 && (
                            <Widget
                                title="Clusters"
                                // icon={
                                //     <Tooltip title="Download clusters" arrow>
                                //         <DownloadIcon color="primary" />
                                //     </Tooltip>
                                // }
                            >
                                <BarGraph />
                            </Widget>
                        )}
                    </>
                </SideBar>
                {renderMessageBox()}
            </ProjectorContext.Provider>
        </ProjectorLayout>
    );
};

export default ProjectorTemplate;
