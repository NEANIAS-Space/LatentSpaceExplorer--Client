import React, { useState } from 'react';
import ProjectorLayout from 'app/components/layouts/projector-layout';
import SideBar from 'app/components/modules/sidebar';
import PrimaryContent from 'app/components/modules/primary-content';
import Graph from 'app/components/elements/graph';
import ProjectorContext from 'app/contexts/projector/context';
import VisualizationForm from 'app/components/modules/forms/visualization';
import ReductionForm from 'app/components/modules/forms/reduction';
import ClusterForm from 'app/components/modules/forms/cluster';
import PreviewImage from 'app/components/elements/preview-image';
import ClustersList from 'app/components/elements/clusters-list';

const ProjectorTemplate = () => {
    const [graphData, setGraphData] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewImageIsLocked, setPreviewImageIsLocked] = useState(false);

    return (
        <ProjectorLayout>
            <ProjectorContext.Provider
                value={{
                    graphData,
                    setGraphData,
                    previewImage,
                    setPreviewImage,
                    previewImageIsLocked,
                    setPreviewImageIsLocked,
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
                        {graphData.length > 0 && <ClustersList />}
                    </>
                </SideBar>
            </ProjectorContext.Provider>
        </ProjectorLayout>
    );
};

export default ProjectorTemplate;
