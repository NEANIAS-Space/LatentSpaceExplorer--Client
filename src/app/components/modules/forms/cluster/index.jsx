import { useContext, useState, useEffect, useReducer } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import ProjectorContext from 'app/contexts/projector';
import projectorFormReducer from 'app/reducers/projector';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Widget from 'app/components/modules/widget';
import SimpleSelect from 'app/components/elements/selects/simple';
import Slider from 'app/components/elements/slider';
import LoadingButton from 'app/components/elements/buttons/loading';
import { postCluster, getPendingClustersCount } from 'app/api/cluster';
import sleep from 'app/utils/chronos';
import humps from 'humps';

const ClusterForm = () => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const { setUpdateClusters } = useContext(ProjectorContext);

    const monitoringFrequency = 5000;
    const [monitoringPendingCount, setMonitoringPendingCount] = useState(false);
    const [previousPendingCount, setPreviousPendingCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    const [submitLoading, setSubmitLoading] = useState(false);

    const userId = session.user.email;
    const experimentId = router.query.id;

    const initialFormState = {
        algorithm: 'dbscan',
        dbscan: {
            eps: 0.5,
            minSamples: 5,
            metric: 'euclidean',
        },
        kmeans: {
            nClusters: 8,
        },
        agglomerativeClustering: {
            distanceThreshold: 5,
            affinity: 'euclidean',
            linkage: 'ward',
        },
        spectralClustering: {
            nClusters: 8,
            affinity: 'nearest_neighbors',
            nNeighbors: 10,
        },
        optics: {
            minSamples: 5,
            metric: 'euclidean',
            clusterMethod: 'xi',
            minClusterSize: 0,
        },
        gaussianMixture: {
            nComponents: 2,
            initParams: 'kmeans',
        },
        birch: {
            nClusters: 3,
            threshold: 0.5,
        },
    };

    const [formState, dispatch] = useReducer(
        projectorFormReducer,
        initialFormState,
    );

    const algorithmOptions = [
        { id: 'dbscan', value: 'dbscan' },
        { id: 'affinityPropagation', value: 'affinity propagation' },
        { id: 'kmeans', value: 'kmeans' },
        {
            id: 'agglomerativeClustering',
            value: 'agglomerative clustering',
        },
        { id: 'spectralClustering', value: 'spectral clustering' },
        { id: 'optics', value: 'optics' },
        { id: 'gaussianMixture', value: 'gaussian mixture' },
        { id: 'birch', value: 'birch' },
    ];

    const metricOptions = [
        { id: 'euclidean', value: 'euclidean' },
        { id: 'cosine', value: 'cosine' },
        { id: 'minkowski', value: 'minkowski' },
        { id: 'manhattan', value: 'manhattan' },
        { id: 'chebyshev', value: 'chebyshev' },
        { id: 'canberra', value: 'canberra' },
        { id: 'mahalanobis', value: 'mahalanobis' },
    ];

    const AGAffinintyOptions = [
        { id: 'euclidean', value: 'euclidean' },
        { id: 'cosine', value: 'cosine' },
        { id: 'manhattam', value: 'manhattam' },
    ];

    const SCAffinintyOptions = [
        { id: 'nearest_neighbors', value: 'nearest_neighbors' },
        { id: 'rbf', value: 'rbf' },
    ];

    const linkageOptions = [
        { id: 'ward', value: 'ward' },
        { id: 'complete', value: 'complete' },
        { id: 'average', value: 'average' },
        { id: 'single', value: 'single' },
    ];

    const clusterMethodOptions = [
        { id: 'xi', value: 'xi' },
        { id: 'dbscan', value: 'dbscan' },
    ];

    const initParamsOptions = [
        { id: 'kmeans', value: 'kmeans' },
        { id: 'random', value: 'random' },
    ];

    const handleCommonParams = (event) => {
        dispatch({
            type: 'COMMON',
            field: event.target.name,
            value: event.target.value,
        });
    };

    const handleAlgorithmParams = (event) => {
        let value;

        switch (event.target.type) {
            case 'number':
                value = Number(event.target.value);
                break;

            default:
                value = String(event.target.value);
        }

        dispatch({
            type: 'ALGORITHM',
            algorithm: formState.algorithm,
            field: event.target.name,
            value,
        });
    };

    const fetchPendingCount = () => {
        getPendingClustersCount(userId, experimentId)
            .then((response) => {
                setPreviousPendingCount(pendingCount);
                setPendingCount(response.data.count);

                if (response.data.count > 0) {
                    // keep fetching
                    sleep(10000).then(() => fetchPendingCount());
                } else {
                    setMonitoringPendingCount(false);
                }
            })
            .catch((error) => {
                setMonitoringPendingCount(false);
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const handleSubmit = async () => {
        if (!submitLoading) {
            setSubmitLoading(true);

            const { algorithm } = formState;
            const hasParams = !!formState[algorithm];
            const params = hasParams ? formState[algorithm] : {};

            postCluster(
                userId,
                experimentId,
                humps.decamelize(algorithm, { separator: '_' }),
                humps.decamelizeKeys(params, { separator: '_' }),
            )
                .then(() =>
                    sleep(monitoringFrequency).then(() => {
                        setSubmitLoading(false);

                        setPendingCount(pendingCount + 1);

                        // fetch if not already fetching
                        if (!monitoringPendingCount) {
                            fetchPendingCount();
                        }
                    }),
                )
                .catch((error) => {
                    setOpenMessageBox(true);
                    setErrorMessage(error.response.data.message);
                    setSubmitLoading(false);
                });
        }
    };

    useEffect(() => {
        if (pendingCount <= previousPendingCount) {
            // update visualization form
            setUpdateClusters(true);
        }
    }, [previousPendingCount, pendingCount, setUpdateClusters]);

    useEffect(
        () => {
            setMonitoringPendingCount(true);
            fetchPendingCount();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <Widget
            title="Cluster"
            icon={
                <>
                    <Tooltip title="Pending clusters" arrow>
                        <Badge badgeContent={pendingCount} color="secondary">
                            <ScheduleIcon
                                color={
                                    pendingCount === 0 ? 'disabled' : 'primary'
                                }
                            />
                        </Badge>
                    </Tooltip>
                </>
            }
        >
            <form>
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="algorithm">Algorithm</InputLabel>
                    <SimpleSelect
                        name="algorithm"
                        options={algorithmOptions}
                        value={formState.algorithm}
                        setValue={handleCommonParams}
                    />
                </FormControl>

                {/* DBSCAN */}
                {formState.algorithm === 'dbscan' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">EPS</Typography>
                            <Slider
                                name="eps"
                                value={formState.dbscan.eps}
                                step={0.01}
                                min={0.01}
                                max={10}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Min. Samples
                            </Typography>
                            <Slider
                                name="minSamples"
                                value={formState.dbscan.minSamples}
                                step={1}
                                min={1}
                                max={300}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="metric">Metric</InputLabel>
                            <SimpleSelect
                                name="metric"
                                options={metricOptions}
                                value={formState.dbscan.metric}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                {/* KMeans */}
                {formState.algorithm === 'kmeans' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Number of clusters
                            </Typography>
                            <Slider
                                name="nClusters"
                                value={formState.kmeans.nClusters}
                                step={1}
                                min={2}
                                max={100}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                {/* Agglomerative Clustering */}
                {formState.algorithm === 'agglomerativeClustering' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Distance Threshold
                            </Typography>
                            <Slider
                                name="distanceThreshold"
                                value={
                                    formState.agglomerativeClustering
                                        .distanceThreshold
                                }
                                step={1}
                                min={1}
                                max={100}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="affinity">Affinity</InputLabel>
                            <SimpleSelect
                                name="affinity"
                                options={AGAffinintyOptions}
                                value={
                                    formState.agglomerativeClustering.affinity
                                }
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="linkage">Linkage</InputLabel>
                            <SimpleSelect
                                name="linkage"
                                options={linkageOptions}
                                value={
                                    formState.agglomerativeClustering.linkage
                                }
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                {/* Spectral Clustering */}
                {formState.algorithm === 'spectralClustering' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Number of clusters
                            </Typography>
                            <Slider
                                name="nClusters"
                                value={formState.spectralClustering.nClusters}
                                step={1}
                                min={2}
                                max={100}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="affinity">Affinity</InputLabel>
                            <SimpleSelect
                                name="affinity"
                                options={SCAffinintyOptions}
                                value={formState.spectralClustering.affinity}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">Neighbors</Typography>
                            <Slider
                                name="nNeighbors"
                                value={formState.spectralClustering.nNeighbors}
                                step={1}
                                min={1}
                                max={100}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                {/* Optics */}
                {formState.algorithm === 'optics' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Min. Samples
                            </Typography>
                            <Slider
                                name="minSamples"
                                value={formState.optics.minSamples}
                                step={1}
                                min={1}
                                max={300}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="metric">Metric</InputLabel>
                            <SimpleSelect
                                name="metric"
                                options={metricOptions}
                                value={formState.optics.metric}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="clusterMethod">
                                Cluster Method
                            </InputLabel>
                            <SimpleSelect
                                name="clusterMethod"
                                options={clusterMethodOptions}
                                value={formState.optics.clusterMethod}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Min. Cluster Size
                            </Typography>
                            <Slider
                                name="minClusterSize"
                                value={formState.optics.minClusterSize}
                                step={0.01}
                                min={0}
                                max={0.99}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                {/* Gaussian Mixture */}
                {formState.algorithm === 'gaussianMixture' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Number of components
                            </Typography>
                            <Slider
                                name="nComponents"
                                value={formState.gaussianMixture.nComponents}
                                step={1}
                                min={2}
                                max={100}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="initParams">Init Params</InputLabel>
                            <SimpleSelect
                                name="initParams"
                                options={initParamsOptions}
                                value={formState.gaussianMixture.initParams}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                {/* Birch */}
                {formState.algorithm === 'birch' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Number of clusters
                            </Typography>
                            <Slider
                                name="nClusters"
                                value={formState.birch.nClusters}
                                step={1}
                                min={2}
                                max={100}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">Threshold</Typography>
                            <Slider
                                name="threshold"
                                value={formState.birch.threshold}
                                step={0.1}
                                min={0}
                                max={1}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                <LoadingButton
                    text="Compute"
                    type="submit"
                    color="primary"
                    isLoading={submitLoading}
                    onClick={handleSubmit}
                />
            </form>
        </Widget>
    );
};

export default ClusterForm;
