import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ProjectorLayout from 'app/components/layouts/projector-layout';
import ProjectorContext from 'app/contexts/projector';
import SideBar from 'app/components/modules/sidebar';
import PrimaryContent from 'app/components/modules/primary-content';
import VisualizationForm from 'app/components/modules/forms/visualization';
import ReductionForm from 'app/components/modules/forms/reduction';
import ClusterForm from 'app/components/modules/forms/cluster';
import MessageBox from 'app/components/elements/message-box';
import { ScatterGraph } from 'app/components/elements/graphs/scatter';
import { SilhouetteGraph } from 'app/components/elements/graphs/silhouette';
import { BarGraph } from 'app/components/elements/graphs/bar';
import PreviewImage from 'app/components/elements/preview-image';
import Widget from 'app/components/elements/widget';
import WordCloudWidget from 'app/components/modules/widgets/wordcloud';

const ProjectorTemplate = () => {
    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [updateReductions, setUpdateReductions] = useState(false);
    const [updateClusters, setUpdateClusters] = useState(false);

    const [scatterGraphData, setScatterGraphData] = useState([]);
    const [silhouetteGraphData, setSilhouetteGraphData] = useState([]);
    const [barGraphData, setBarGraphData] = useState([]);
    const [clustersScores, setClustersScores] = useState([]);
    const [wordCloudData, setWordCloudData] = useState([]);

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
                    clustersScores,
                    setClustersScores,
                    wordCloudData,
                    setWordCloudData,
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
                        {Object.keys(clustersScores).length > 0 && (
                            <Widget title="Clusters scores">
                                <>
                                    <Grid container>
                                        <Grid item xs={8}>
                                            Calinski Harabasz:
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box textAlign="right">
                                                {clustersScores.calinski_harabasz_score.toFixed(
                                                    2,
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={8}>
                                            Davies Bouldin:
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box textAlign="right">
                                                {clustersScores.davies_bouldin_score.toFixed(
                                                    2,
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </>
                            </Widget>
                        )}
                        {barGraphData.length > 0 && (
                            <Widget title="Elements per clusters">
                                <BarGraph />
                            </Widget>
                        )}
                        {wordCloudData.length > 0 && <WordCloudWidget />}
                    </>
                </SideBar>
                {renderMessageBox()}
            </ProjectorContext.Provider>
        </ProjectorLayout>
    );
};

export default ProjectorTemplate;
