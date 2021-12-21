import { useState } from 'react';
import ProjectorLayout from 'app/components/layouts/projector-layout';
import ProjectorContext from 'app/contexts/projector';
import SideBar from 'app/components/modules/sidebar';
import PrimaryContent from 'app/components/modules/primary-content';
import VisualizationForm from 'app/components/modules/forms/visualization';
import ReductionForm from 'app/components/modules/forms/reduction';
import ClusterForm from 'app/components/modules/forms/cluster';
import MessageBox from 'app/components/elements/message-box';
import Graph from 'app/components/elements/graph';
import PreviewImage from 'app/components/elements/preview-image';

const ProjectorTemplate = () => {
    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [updateReductions, setUpdateReductions] = useState(false);
    const [updateClusters, setUpdateClusters] = useState(false);

    const [graphData, setGraphData] = useState([]);

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
                    graphData,
                    setGraphData,
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
                    <Graph />
                </PrimaryContent>
                <SideBar column={3}>
                    <>
                        {previewImage && (
                            <PreviewImage imageName={previewImage} />
                        )}
                    </>
                </SideBar>
                {renderMessageBox()}
            </ProjectorContext.Provider>
        </ProjectorLayout>
    );
};

export default ProjectorTemplate;
