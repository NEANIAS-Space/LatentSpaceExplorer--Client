import { useState } from 'react';
import ProjectorLayout from 'app/components/layouts/projector-layout';
import ProjectorContext from 'app/contexts/projector';
import SideBar from 'app/components/modules/sidebar';
import PrimaryContent from 'app/components/modules/primary-content';
import VisualizationForm from 'app/components/modules/forms/visualization';
import ReductionForm from 'app/components/modules/forms/reduction';
import ClusterForm from 'app/components/modules/forms/cluster';
import MessageBox from 'app/components/elements/message-box';
import ScatterGraph from 'app/components/elements/graphs/scatter';
import PreviewImage from 'app/components/elements/preview-image';
import WordCloudWidget from 'app/components/modules/widgets/wordcloud';
import BarGraphWidget from 'app/components/modules/widgets/bar';
import SilhouetteGraphWidget from 'app/components/modules/widgets/silhouette';
import ScoresWidget from 'app/components/modules/widgets/scores';

const ProjectorTemplate = () => {
    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [triggerFetchReductions, setTriggerFetchReductions] = useState(true);
    const [triggerFetchClusters, setTriggerFetchClusters] = useState(true);

    const [previewImage, setPreviewImage] = useState('');

    const [ids, setIds] = useState([]);
    const [points, setPoints] = useState([]);
    const [components, setComponents] = useState(2);
    const [groups, setGroups] = useState([]);
    const [silhouettes, setSilhouettes] = useState([]);
    const [scores, setScores] = useState({});
    const [attributes, setAttributes] = useState([]);

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
                    setOpenMessageBox,
                    setErrorMessage,
                    triggerFetchReductions,
                    setTriggerFetchReductions,
                    triggerFetchClusters,
                    setTriggerFetchClusters,
                    setPreviewImage,
                    ids,
                    setIds,
                    points,
                    setPoints,
                    components,
                    setComponents,
                    groups,
                    setGroups,
                    silhouettes,
                    setSilhouettes,
                    scores,
                    setScores,
                    attributes,
                    setAttributes,
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
                    <>
                        {components > 0 &&
                            points.length > 0 &&
                            ids.length > 0 &&
                            groups.length > 0 && (
                                <ScatterGraph
                                    components={components}
                                    points={points}
                                    ids={ids}
                                    groups={groups}
                                />
                            )}
                    </>
                </PrimaryContent>
                <SideBar column={3}>
                    <>
                        {previewImage && (
                            <PreviewImage imageName={previewImage} />
                        )}
                        {groups.length > 0 && silhouettes.length > 0 && (
                            <SilhouetteGraphWidget />
                        )}
                        {Object.keys(scores).length > 0 && <ScoresWidget />}
                        {groups.length > 0 && <BarGraphWidget />}
                        {Object.keys(attributes).length > 0 &&
                            groups.length > 0 && <WordCloudWidget />}
                    </>
                </SideBar>
                {renderMessageBox()}
            </ProjectorContext.Provider>
        </ProjectorLayout>
    );
};

export default ProjectorTemplate;
