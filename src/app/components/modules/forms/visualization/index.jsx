import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { getReduction, deleteReduction } from 'app/api/reduction';
import { getCluster, deleteCluster } from 'app/api/cluster';
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

    const { reductions, setReductions } = useContext(ProjectorContext);
    const { clusters, setClusters } = useContext(ProjectorContext);
    const { labels } = useContext(ProjectorContext);
    const { attributes } = useContext(ProjectorContext);
    const { setIds } = useContext(ProjectorContext);
    const { setPoints } = useContext(ProjectorContext);
    const { setComponents } = useContext(ProjectorContext);
    const { groups, setGroups } = useContext(ProjectorContext);
    const { setSilhouettes } = useContext(ProjectorContext);
    const { setScores } = useContext(ProjectorContext);
    const { setPreviewImageName } = useContext(ProjectorContext);

    const [reductionId, setReductionId] = useState('');
    const [clusterId, setClusterId] = useState('');
    const [labelId, setLabelId] = useState('');

    const userId = session.user.email;
    const experimentId = router.query.id;

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
        setSilhouettes([]);
        setScores({});
        setPreviewImageName('');
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

    useEffect(fetchReduction, [
        experimentId,
        groups,
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
