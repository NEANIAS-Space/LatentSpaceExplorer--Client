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
import Widget from 'app/components/elements/widget';
import SimpleSelect from 'app/components/elements/selects/simple';
import AdvancedSelect from 'app/components/elements/selects/advanced';

const VisualizationForm = () => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const { triggerFetchReductions, setTriggerFetchReductions } =
        useContext(ProjectorContext);
    const { triggerFetchClusters, setTriggerFetchClusters } =
        useContext(ProjectorContext);

    const { setIds } = useContext(ProjectorContext);
    const { setPoints } = useContext(ProjectorContext);
    const { setComponents } = useContext(ProjectorContext);
    const { groups, setGroups } = useContext(ProjectorContext);
    const { setSilhouettes } = useContext(ProjectorContext);
    const { setScores } = useContext(ProjectorContext);
    const { attributes, setAttributes } = useContext(ProjectorContext);
    const { setPreviewImage } = useContext(ProjectorContext);

    const [reductionId, setReductionId] = useState('');
    const [reductions, setReductions] = useState([]);
    const [clusterId, setClusterId] = useState('');
    const [clusters, setClusters] = useState([]);
    const [labelId, setLabelId] = useState('');
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
        if (triggerFetchReductions) {
            setTriggerFetchReductions(false);

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
        if (triggerFetchClusters) {
            setTriggerFetchClusters(false);

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

                setLabels(options);
                setAttributes(response.data);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const fetchReduction = () => {
        if (reductionId) {
            getReduction(userId, experimentId, reductionId)
                .then((response) => {
                    try {
                        const { ids, points } = response.data;
                        const { components } = response.data.metadata;

                        setIds(ids);
                        setPoints(points);
                        setComponents(components);

                        if (groups.length < 1) {
                            setGroups(Array.from(ids).fill(0));
                        }
                    } catch (error) {
                        setOpenMessageBox(true);
                        setErrorMessage(
                            'Error, the format of the reduction data is not valid',
                        );
                    }
                })
                .catch((error) => {
                    setOpenMessageBox(true);
                    setErrorMessage(error.response.data.message);
                });
        }
    };

    const fetchCluster = () => {
        if (clusterId) {
            getCluster(userId, experimentId, clusterId)
                .then((response) => {
                    try {
                        const { groups, silhouettes, scores } = response.data;

                        setGroups(groups);
                        setSilhouettes(silhouettes);
                        setScores(scores);
                    } catch (error) {
                        setOpenMessageBox(true);
                        setErrorMessage(
                            'Error, the format of the cluster data is not valid',
                        );
                    }
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
        // setGroups([]);
        setSilhouettes([]);
        setScores({});
        setPreviewImage('');
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
        experimentId,
        setErrorMessage,
        setOpenMessageBox,
        setTriggerFetchReductions,
        triggerFetchReductions,
        userId,
    ]);
    useEffect(fetchClusters, [
        experimentId,
        setErrorMessage,
        setOpenMessageBox,
        setTriggerFetchClusters,
        triggerFetchClusters,
        userId,
    ]);
    useEffect(fetchLabels, [
        experimentId,
        setAttributes,
        setErrorMessage,
        setOpenMessageBox,
        userId,
    ]);
    useEffect(fetchReduction, [
        experimentId,
        groups.length,
        reductionId,
        setComponents,
        setErrorMessage,
        setGroups,
        setIds,
        setOpenMessageBox,
        setPoints,
        userId,
    ]);
    useEffect(fetchCluster, [
        clusterId,
        experimentId,
        setErrorMessage,
        setGroups,
        setOpenMessageBox,
        setScores,
        setSilhouettes,
        userId,
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
                    {...((labels.length === 0 || !reductionId) && {
                        disabled: true,
                    })}
                >
                    <InputLabel id="label">Label</InputLabel>
                    <SimpleSelect
                        name="label"
                        options={labels}
                        value={labelId}
                        setValue={(event) => {
                            const id = event.target.value;
                            setGroups(attributes.data[id]);
                            setLabelId(id);
                        }}
                        onChange={switchToLabel}
                    />
                </FormControl>
            </form>
        </Widget>
    );
};

export default VisualizationForm;
