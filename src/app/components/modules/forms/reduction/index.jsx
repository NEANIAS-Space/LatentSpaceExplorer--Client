import { useState, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { FormControl, InputLabel } from '@material-ui/core';
import ProjectorContext from 'app/contexts/projector';
import reductionFormReducer from 'app/reducers/reduction';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Widget from 'app/components/modules/widget';
import SimpleSelect from 'app/components/elements/selects/simple';
import LoadingButton from 'app/components/elements/loading-button';
import Slider from 'app/components/elements/slider';
import { postReduction, getPendingReductionsCount } from 'app/api/reduction';
import sleep from 'app/utils/chronos';
import camelCaseKeysToUnderscore from 'app/utils/formatter';

const ReductionForm = () => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const { setUpdateReductions } = useContext(ProjectorContext);

    const initialFormState = {
        algorithm: 'pca',
        components: 2,
        tsne: {
            perplexity: 10,
            iterations: 1000,
            learningRate: 200,
            metric: 'euclidean',
            init: 'random',
        },
        umap: {
            neighbors: 15,
            minDistance: 0.1,
            metric: 'euclidean',
            densmap: false,
        },
        isomap: {
            neighbors: 15,
            metric: 'euclidean',
        },
    };

    const [formState, dispatch] = useReducer(
        reductionFormReducer,
        initialFormState,
    );

    const algorithmOptions = [
        { id: 'pca', value: 'pca' },
        { id: 'tsne', value: 'tsne' },
        { id: 'umap', value: 'umap' },
        { id: 'truncated_svd', value: 'truncated svd' },
        { id: 'spectral_embedding', value: 'spectral embedding' },
        { id: 'isomap', value: 'isomap' },
        { id: 'mds', value: 'mds' },
    ];

    const componentsOptions = [
        { id: 2, value: 2 },
        { id: 3, value: 3 },
    ];

    const metricOptions = [
        { id: 'euclidean', value: 'euclidean' },
        { id: 'cosine', value: 'cosine' },
    ];

    const initOptions = [
        { id: 'random', value: 'random' },
        { id: 'pca', value: 'pca' },
    ];

    const [monitoringPendingCount, setMonitoringPendingCount] = useState(false);
    const [previousPendingCount, setPreviousPendingCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    const [submitLoading, setSubmitLoading] = useState(false);

    const userId = session.user.email;
    const experimentId = router.query.id;

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

            case 'checkbox':
                value = Boolean(event.target.checked);
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
        setMonitoringPendingCount(true);

        getPendingReductionsCount(userId, experimentId)
            .then((tasks) => {
                setPreviousPendingCount(pendingCount);
                setPendingCount(tasks.count);

                if (tasks.count > 0) {
                    // keep fetching
                    sleep(10000).then(fetchPendingCount());
                } else {
                    setMonitoringPendingCount(false);
                }
            })
            .catch((e) => {
                setMonitoringPendingCount(false);
                setOpenMessageBox(true);
                setErrorMessage(JSON.stringify(e.response.data.detail));
            });
    };

    const handleSubmit = async () => {
        if (!submitLoading) {
            setSubmitLoading(true);

            const { algorithm, components } = formState;
            const hasParams = !!formState[algorithm];
            const params = hasParams
                ? camelCaseKeysToUnderscore(formState[algorithm])
                : {};

            postReduction(userId, experimentId, algorithm, components, params)
                .then(() =>
                    sleep(1000).then(() => {
                        setSubmitLoading(false);

                        setPendingCount(pendingCount + 1);

                        // fetch if not already fetching
                        if (!monitoringPendingCount) {
                            fetchPendingCount();
                        }
                    }),
                )
                .catch((e) => {
                    setOpenMessageBox(true);
                    setErrorMessage(JSON.stringify(e.response.data.detail));
                    setSubmitLoading(false);
                });
        }
    };

    useEffect(() => {
        if (pendingCount <= previousPendingCount) {
            // update visualization form
            setUpdateReductions(true);
        }
    }, [previousPendingCount, pendingCount, setUpdateReductions]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchPendingCount, []);

    return (
        <Widget
            title="Reduction"
            icon={
                <>
                    <Tooltip title="Pending reductions">
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
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="components">Components</InputLabel>
                    <SimpleSelect
                        name="components"
                        options={componentsOptions}
                        value={formState.components}
                        setValue={handleCommonParams}
                    />
                </FormControl>

                {/* TSNE */}
                {formState.algorithm === 'tsne' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Perplexity
                            </Typography>
                            <Slider
                                name="perplexity"
                                value={formState.tsne.perplexity}
                                step={1}
                                min={5}
                                max={50}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Iterations
                            </Typography>
                            <Slider
                                name="iterations"
                                value={formState.tsne.iterations}
                                step={1}
                                min={250}
                                max={5000}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Learning Rate
                            </Typography>
                            <Slider
                                name="learningRate"
                                value={formState.tsne.learningRate}
                                step={1}
                                min={10}
                                max={1000}
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
                                value={formState.tsne.metric}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <InputLabel id="init">init</InputLabel>
                            <SimpleSelect
                                name="init"
                                options={initOptions}
                                value={formState.tsne.init}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                    </>
                )}

                {/* UMAP */}
                {formState.algorithm === 'umap' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">Neighbors</Typography>
                            <Slider
                                name="neighbors"
                                value={formState.umap.neighbors}
                                step={1}
                                min={2}
                                max={200}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Min. Distance
                            </Typography>
                            <Slider
                                name="minDistance"
                                value={formState.umap.minDistance}
                                step={0.01}
                                min={0.01}
                                max={0.99}
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
                                value={formState.umap.metric}
                                setValue={handleAlgorithmParams}
                            />
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            margin="dense"
                            fullWidth
                        >
                            <Typography variant="caption">Densmap</Typography>
                            <Switch
                                name="densmap"
                                checked={formState.umap.densmap}
                                onChange={handleAlgorithmParams}
                                color="primary"
                            />
                        </FormControl>
                    </>
                )}

                {/* Isomap */}
                {formState.algorithm === 'isomap' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">Neighbors</Typography>
                            <Slider
                                name="neighbors"
                                value={formState.isomap.neighbors}
                                step={1}
                                min={2}
                                max={200}
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
                                value={formState.isomap.metric}
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

export default ReductionForm;
