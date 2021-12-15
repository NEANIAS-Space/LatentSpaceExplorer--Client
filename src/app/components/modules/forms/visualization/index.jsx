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

    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
                setErrorMessage(e.response);
            });
    };

    const fetchClusters = () => {
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
                setErrorMessage(e.response.data.detail);
            });
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
                setErrorMessage(e.response.data.detail);
            });
    };

    const fetchGraphData = () => {
        if (reductionId && clusterId) {
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
                    setErrorMessage(e.response.data.detail);
                });
        } else if (reductionId && labelId) {
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
                    setErrorMessage(e.response.data.detail);
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
                    setErrorMessage(e.response.data.detail);
                });
        }
    };

    const switchToCluster = () => {
        setLabelId('');
    };

    const switchToLabel = () => {
        setClusterId('');
    };

    useEffect(fetchReductions, [userId, experimentId]);
    useEffect(fetchClusters, [userId, experimentId]);
    useEffect(fetchLabels, [userId, experimentId]);
    useEffect(fetchGraphData, [
        userId,
        experimentId,
        reductionId,
        clusterId,
        labelId,
        labels,
        setGraphData,
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
                        id="reduction"
                        value={reductionId}
                        options={reductions}
                        setValue={setReductionId}
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
                        id="cluster"
                        options={clusters}
                        value={clusterId}
                        setValue={setClusterId}
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
                        id="label"
                        options={labelsNames}
                        value={labelId}
                        setValue={setLabelId}
                        onChange={switchToLabel}
                    />
                </FormControl>
            </form>
        </Widget>
    );
};

export default VisualizationForm;
