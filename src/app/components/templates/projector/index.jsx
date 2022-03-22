import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { getReductions } from 'app/api/reduction';
import { getClusters } from 'app/api/cluster';
import { getLabels } from 'app/api/label';
import { getImagesFolderName } from 'app/api/image';
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
    const [session] = useSession();
    const router = useRouter();

    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [reductions, setReductions] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [labels, setLabels] = useState([]);
    const [attributes, setAttributes] = useState([]);

    const [triggerFetchReductions, setTriggerFetchReductions] = useState(true);
    const [triggerFetchClusters, setTriggerFetchClusters] = useState(true);

    const [previewImagesFolderName, setPreviewImagesFolderName] = useState('');
    const [previewImageName, setPreviewImageName] = useState('');

    const [ids, setIds] = useState([]);
    const [points, setPoints] = useState([]);
    const [components, setComponents] = useState(2);
    const [groups, setGroups] = useState([]);
    const [silhouettes, setSilhouettes] = useState([]);
    const [scores, setScores] = useState({});

    const userId = session.user.email;
    const experimentId = router.query.id;

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

    const compare = (object1, object2) => {
        if (object1.algorithm > object2.algorithm) {
            return 1;
        }
        if (object1.algorithm < object2.algorithm) {
            return -1;
        }
        if (object1.components > object2.components) {
            return 1;
        }
        if (object1.components < object2.components) {
            return -1;
        }
        return 0;
    };

    const fetchReductions = () => {
        if (triggerFetchReductions) {
            getReductions(userId, experimentId)
                .then((response) => {
                    const options = response.data.map((option) => {
                        const {
                            id,
                            metadata: {
                                algorithm,
                                components,
                                params,
                                start_datetime: datetime,
                            },
                        } = option;

                        return {
                            id,
                            algorithm,
                            components,
                            params,
                            datetime,
                        };
                    });

                    options.sort(compare);

                    setReductions(options);
                })
                .catch((error) => {
                    setOpenMessageBox(true);
                    setErrorMessage(error.response.data.message);
                })
                .finally(() => {
                    setTriggerFetchReductions(false);
                });
        }
    };

    const fetchClusters = () => {
        if (triggerFetchClusters) {
            getClusters(userId, experimentId)
                .then((response) => {
                    const options = response.data.map((option) => {
                        const {
                            id,
                            metadata: {
                                algorithm,
                                params,
                                start_datetime: datetime,
                            },
                        } = option;

                        return {
                            id,
                            algorithm,
                            params,
                            datetime,
                        };
                    });

                    options.sort(compare);

                    setClusters(options);
                })
                .catch((error) => {
                    setOpenMessageBox(true);
                    setErrorMessage(error.response.data.message);
                })
                .finally(() => {
                    setTriggerFetchClusters(false);
                });
        }
    };

    const fetchLabels = () => {
        getLabels(userId, experimentId)
            .then((response) => {
                const options = response.data.index.map((value, id) => ({
                    id,
                    value,
                }));

                setLabels(options);
                setAttributes(response.data);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const fetchImagesFolderName = () => {
        getImagesFolderName(userId, experimentId)
            .then((response) => {
                const imagesFolderName = response.data.images_folder_name;

                setPreviewImagesFolderName(imagesFolderName);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const contextVars = {
        setOpenMessageBox,
        setErrorMessage,
        reductions,
        setReductions,
        clusters,
        setClusters,
        labels,
        setLabels,
        attributes,
        setAttributes,
        setTriggerFetchReductions,
        setTriggerFetchClusters,
        setPreviewImagesFolderName,
        setPreviewImageName,
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
    };

    useEffect(fetchReductions, [experimentId, triggerFetchReductions, userId]);
    useEffect(fetchClusters, [experimentId, triggerFetchClusters, userId]);
    useEffect(fetchLabels, [experimentId, userId]);
    useEffect(fetchImagesFolderName, [experimentId, userId]);

    return (
        <ProjectorLayout>
            <ProjectorContext.Provider value={contextVars}>
                <SideBar column={1}>
                    <>
                        <VisualizationForm />
                        <ReductionForm
                            trigger={{
                                triggerFetchReductions,
                                setTriggerFetchReductions,
                            }}
                        />
                        <ClusterForm
                            trigger={{
                                triggerFetchClusters,
                                setTriggerFetchClusters,
                            }}
                        />
                    </>
                </SideBar>
                <PrimaryContent>
                    <>
                        {components > 0 &&
                            points.length > 0 &&
                            ids.length > 0 &&
                            groups.length > 0 && <ScatterGraph />}
                    </>
                </PrimaryContent>
                <SideBar column={3}>
                    <>
                        {previewImagesFolderName && previewImageName && (
                            <PreviewImage
                                imagesFolderName={previewImagesFolderName}
                                imageName={previewImageName}
                            />
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
