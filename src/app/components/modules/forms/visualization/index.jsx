import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import {
    getReductions,
    getReduction,
    deleteReduction,
} from 'app/api/reduction';
import { getClusters, getCluster, deleteCluster } from 'app/api/cluster';
import { getLabels } from 'app/api/label';
import { FormControl, InputLabel } from '@material-ui/core';
import ProjectorContext from 'app/contexts/projector';
import Widget from 'app/components/modules/widget';
import SimpleSelect from 'app/components/elements/selects/simple';
import AdvancedSelect from 'app/components/elements/selects/advanced';
import { ScatterGraphManager } from 'app/components/elements/graphs/scatter';
import { SilohouetteGraphManager } from 'app/components/elements/graphs/silhouette';
import { BarGraphManager } from 'app/components/elements/graphs/bar';

const VisualizationForm = () => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const { updateReductions, setUpdateReductions } =
        useContext(ProjectorContext);
    const { updateClusters, setUpdateClusters } = useContext(ProjectorContext);

    const { setScatterGraphData } = useContext(ProjectorContext);
    const { setSilhouetteGraphData } = useContext(ProjectorContext);
    const { setBarGraphData } = useContext(ProjectorContext);
    const { setClustersScores } = useContext(ProjectorContext);

    const [reductionId, setReductionId] = useState('');
    const [reductions, setReductions] = useState([]);
    const [clusterId, setClusterId] = useState('');
    const [clusters, setClusters] = useState([]);
    const [labelId, setLabelId] = useState('');
    const [labelsNames, setLabelsNames] = useState([]);
    const [labels, setLabels] = useState([]);

    const userId = session.user.email;
    const experimentId = router.query.id;

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
        if (updateReductions) {
            setUpdateReductions(false);
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
                });
        }
    };

    const fetchClusters = () => {
        if (updateClusters) {
            setUpdateClusters(false);

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

                setLabels(response.data);
                setLabelsNames(options);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const fetchGraphData = () => {
        if (reductionId && (clusterId === 0 || clusterId)) {
            Promise.all([
                getReduction(userId, experimentId, reductionId),
                getCluster(userId, experimentId, clusterId),
            ])
                .then((response) => {
                    const [reductionResponse, clusterResponse] = response;

                    const { ids, points } = reductionResponse.data;
                    const { components } = reductionResponse.data.metadata;
                    const { groups: traces } = clusterResponse.data;
                    const { silhouettes, scores } = clusterResponse.data;

                    let scatterGraphData = [];
                    try {
                        scatterGraphData = ScatterGraphManager(
                            components,
                            points,
                            ids,
                            traces,
                        );
                    } catch (error) {
                        setOpenMessageBox(true);
                        setErrorMessage(
                            'An error occurred while generating the scatter plot graph',
                        );
                    }

                    let silhouetteGraphData = [];
                    try {
                        silhouetteGraphData = SilohouetteGraphManager(
                            silhouettes,
                            traces,
                        );
                    } catch (error) {
                        setOpenMessageBox(true);
                        setErrorMessage(
                            'An error occurred while generating the silhouette graph',
                        );
                    }

                    let barGraphData = [];
                    try {
                        barGraphData = BarGraphManager(traces);
                    } catch (error) {
                        setOpenMessageBox(true);
                        setErrorMessage(
                            'An error occurred while generating the bar graph',
                        );
                    }

                    setScatterGraphData(scatterGraphData);
                    setSilhouetteGraphData(silhouetteGraphData);
                    setBarGraphData(barGraphData);
                    setClustersScores(scores);
                })
                .catch((error) => {
                    setOpenMessageBox(true);
                    setErrorMessage(error.response.data.message);
                });
        } else if (reductionId && (labelId === 0 || labelId)) {
            getReduction(userId, experimentId, reductionId)
                .then((response) => {
                    const { ids, points } = response.data;
                    const { components } = response.data.metadata;
                    const traces = labels.data[labelId];

                    let scatterGraphData;
                    try {
                        scatterGraphData = ScatterGraphManager(
                            components,
                            points,
                            ids,
                            traces,
                        );
                    } catch (error) {
                        setOpenMessageBox(true);
                        setErrorMessage(
                            'An error occurred while generating the scatter plot graph',
                        );
                    }

                    setScatterGraphData(scatterGraphData);
                })
                .catch((error) => {
                    setOpenMessageBox(true);
                    setErrorMessage(error.response.data.message);
                });
        } else if (reductionId) {
            getReduction(userId, experimentId, reductionId)
                .then((response) => {
                    const { ids, points } = response.data;
                    const { components } = response.data.metadata;
                    const traces = Array.from(points).fill(0);

                    let scatterGraphData;
                    try {
                        scatterGraphData = ScatterGraphManager(
                            components,
                            points,
                            ids,
                            traces,
                        );
                    } catch (error) {
                        setOpenMessageBox(true);
                        setErrorMessage(
                            'An error occurred while generating the scatter plot graph',
                        );
                    }

                    setScatterGraphData(scatterGraphData);
                })
                .catch((error) => {
                    setOpenMessageBox(true);
                    setErrorMessage(error.response.data.message);
                });
        }
    };

    const switchToCluster = () => {
        setLabelId('');
    };

    const switchToLabel = () => {
        setClusterId('');
        setSilhouetteGraphData([]);
        setBarGraphData([]);
        setClustersScores({});
    };

    const handleDeleteReduction = (id) => {
        deleteReduction(userId, experimentId, id)
            .then(() => {
                const options = reductions.filter(
                    (reduction) => reduction.id !== id,
                );
                setReductions(options);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const handleDeleteCluster = (id) => {
        deleteCluster(userId, experimentId, id)
            .then(() => {
                const options = clusters.filter((cluster) => cluster.id !== id);
                setClusters(options);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    useEffect(fetchReductions, [
        userId,
        experimentId,
        setOpenMessageBox,
        setErrorMessage,
        updateReductions,
        setUpdateReductions,
        fetchReductions,
    ]);
    useEffect(fetchClusters, [
        userId,
        experimentId,
        setOpenMessageBox,
        setErrorMessage,
        updateClusters,
        setUpdateClusters,
    ]);
    useEffect(fetchLabels, [
        userId,
        experimentId,
        setOpenMessageBox,
        setErrorMessage,
    ]);
    useEffect(fetchGraphData, [
        userId,
        experimentId,
        reductionId,
        clusterId,
        labelId,
        labels,
        setScatterGraphData,
        setSilhouetteGraphData,
        setOpenMessageBox,
        setErrorMessage,
        setBarGraphData,
        setClustersScores,
    ]);

    return (
        <Widget title="Visualization">
            <form>
                <FormControl
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    {...(reductions.length === 0 && { disabled: true })}
                >
                    <InputLabel id="reduction">Reduction</InputLabel>
                    <AdvancedSelect
                        name="reduction"
                        value={reductionId}
                        options={reductions}
                        setValue={(event) => setReductionId(event.target.value)}
                        onSecondaryAction={(id) => {
                            handleDeleteReduction(id);
                        }}
                        secondaryAction
                    />
                </FormControl>
                <FormControl
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    {...((clusters.length === 0 || !reductionId) && {
                        disabled: true,
                    })}
                >
                    <InputLabel id="cluster">Cluster</InputLabel>
                    <AdvancedSelect
                        name="cluster"
                        options={clusters}
                        value={clusterId}
                        setValue={(event) => setClusterId(event.target.value)}
                        onChange={switchToCluster}
                        onSecondaryAction={(id) => {
                            handleDeleteCluster(id);
                        }}
                        secondaryAction
                    />
                </FormControl>
                <FormControl
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    {...((labelsNames.length === 0 || !reductionId) && {
                        disabled: true,
                    })}
                >
                    <InputLabel id="label">Label</InputLabel>
                    <SimpleSelect
                        name="label"
                        options={labelsNames}
                        value={labelId}
                        setValue={(event) => setLabelId(event.target.value)}
                        onChange={switchToLabel}
                    />
                </FormControl>
            </form>
        </Widget>
    );
};

export default VisualizationForm;
