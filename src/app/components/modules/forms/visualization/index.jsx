import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { getReductions, getReduction } from 'app/api/reduction';
import { getClusters, getCluster } from 'app/api/cluster';
import { getLabels } from 'app/api/label';
import { FormControl, InputLabel } from '@material-ui/core';
import ProjectorContext from 'app/contexts/projector';
import Widget from 'app/components/modules/widget';
import SimpleSelect from 'app/components/elements/selects/simple';
import AdvancedSelect from 'app/components/elements/selects/advanced';
import GraphManager from 'app/utils/graph';

const VisualizationForm = () => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const { updateReductions, setUpdateReductions } =
        useContext(ProjectorContext);
    const { updateClusters, setUpdateClusters } = useContext(ProjectorContext);

    const { setGraphData } = useContext(ProjectorContext);

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
                .then((results) => {
                    const options = results.map((option) => {
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
                .catch((e) => {
                    setOpenMessageBox(true);
                    setErrorMessage(e.response.data.message);
                });
        }
    };

    const fetchClusters = () => {
        if (updateClusters) {
            setUpdateClusters(false);

            getClusters(userId, experimentId)
                .then((results) => {
                    const options = results.map((option) => {
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
                .catch((e) => {
                    setOpenMessageBox(true);
                    setErrorMessage(e.response.data.message);
                });
        }
    };

    const fetchLabels = () => {
        getLabels(userId, experimentId)
            .then((results) => {
                const options = results.index.map((value, id) => ({
                    id,
                    value,
                }));

                setLabels(results);
                setLabelsNames(options);
            })
            .catch((e) => {
                setOpenMessageBox(true);
                setErrorMessage(e.response.data.message);
            });
    };

    const fetchGraphData = () => {
        if (reductionId && (clusterId || clusterId === 0)) {
            Promise.all([
                getReduction(userId, experimentId, reductionId),
                getCluster(userId, experimentId, clusterId),
            ])
                .then((results) => {
                    const [reductionResult, clusterResult] = results;

                    const { ids, points } = reductionResult;
                    const { components } = reductionResult.metadata;
                    const { groups: traces } = clusterResult;

                    const graphData = GraphManager(
                        components,
                        points,
                        ids,
                        traces,
                    );

                    setGraphData(graphData);
                })
                .catch((e) => {
                    setOpenMessageBox(true);
                    setErrorMessage(e.response.data.message);
                });
        } else if (reductionId && (labelId || labelId === 0)) {
            getReduction(userId, experimentId, reductionId)
                .then((result) => {
                    const { ids, points } = result;
                    const { components } = result.metadata;
                    const traces = labels.data[labelId];

                    const graphData = GraphManager(
                        components,
                        points,
                        ids,
                        traces,
                    );

                    setGraphData(graphData);
                })
                .catch((e) => {
                    setOpenMessageBox(true);
                    setErrorMessage(e.response.data.message);
                });
        } else if (reductionId) {
            getReduction(userId, experimentId, reductionId)
                .then((result) => {
                    const { ids, points } = result;
                    const { components } = result.metadata;
                    const traces = Array.from(points).fill(0);

                    const graphData = GraphManager(
                        components,
                        points,
                        ids,
                        traces,
                    );

                    setGraphData(graphData);
                })
                .catch((e) => {
                    setOpenMessageBox(true);
                    setErrorMessage(e.response.data.message);
                });
        }
    };

    const switchToCluster = () => {
        setLabelId('');
    };

    const switchToLabel = () => {
        setClusterId('');
    };

    useEffect(fetchReductions, [
        userId,
        experimentId,
        setOpenMessageBox,
        setErrorMessage,
        updateReductions,
        setUpdateReductions,
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
        setGraphData,
        setOpenMessageBox,
        setErrorMessage,
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
