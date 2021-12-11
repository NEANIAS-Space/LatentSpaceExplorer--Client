import React from 'react';
import ProjectorLayout from 'app/components/layouts/projector-layout';
import SideBar from 'app/components/modules/sidebar';
import PrimaryContent from 'app/components/modules/primary-content';
import VisualizationForm from 'app/components/modules/forms/visualization';
// import Graph from 'app/components/elements/graph';
// import ProjectorContext from 'app/contexts/projector/context';
// import ReductionForm from 'app/components/modules/forms/reduction';
// import ClusterForm from 'app/components/modules/forms/cluster';
// import PreviewImage from 'app/components/elements/preview-image';
// import ClustersList from 'app/components/elements/clusters-list';

const ProjectorTemplate = () => (
    <ProjectorLayout>
        <>
            <SideBar column={1}>
                <VisualizationForm />
            </SideBar>
            <PrimaryContent>
                <>ciao</>
            </PrimaryContent>
            <SideBar column={3}>
                <>ciao</>
            </SideBar>
        </>
    </ProjectorLayout>
);

export default ProjectorTemplate;
