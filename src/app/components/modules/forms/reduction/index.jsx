import { useState, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import ProjectorContext from 'app/contexts/projector';
import projectorFormReducer from 'app/components/modules/forms/reducer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Widget from 'app/components/modules/widget';
import SimpleSelect from 'app/components/elements/selects/simple';
import Slider from 'app/components/elements/slider';
import LoadingButton from 'app/components/elements/buttons/loading';
import { postReduction, getPendingReductionsCount } from 'app/api/reduction';
import sleep from 'app/utils/chronos';
import humps from 'humps';
import {
    initialFormState,
    algorithmOptions,
    componentsOptions,
    metricOptions,
    initParamsOptions,
    affinityOptions,
} from './init';

const ReductionForm = () => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const { setUpdateReductions } = useContext(ProjectorContext);

    const monitoringFrequency = 5000;
    const [monitoringPendingCount, setMonitoringPendingCount] = useState(false);
    const [previousPendingCount, setPreviousPendingCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    const [submitLoading, setSubmitLoading] = useState(false);

    const userId = session.user.email;
    const experimentId = router.query.id;

    const [formState, dispatch] = useReducer(
        projectorFormReducer,
        initialFormState,
    );

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
        getPendingReductionsCount(userId, experimentId)
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

            const { algorithm, components } = formState;
            const hasParams = !!formState[algorithm];
            const params = hasParams ? formState[algorithm] : {};

            postReduction(
                userId,
                experimentId,
                humps.decamelize(algorithm, { separator: '_' }),
                components,
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
            setUpdateReductions(true);
        }
    }, [previousPendingCount, pendingCount, setUpdateReductions]);

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
            title="Reduction"
            icon={
                <>
                    <Tooltip title="Pending reductions" arrow>
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
                            <InputLabel id="init">Init</InputLabel>
                            <SimpleSelect
                                name="init"
                                options={initParamsOptions}
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
                                min={1}
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

                {/* Spectral Embedding */}
                {formState.algorithm === 'spectralEmbedding' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <FormControl
                                variant="outlined"
                                margin="dense"
                                fullWidth
                            >
                                <InputLabel id="affinity">Affinity</InputLabel>
                                <SimpleSelect
                                    name="affinity"
                                    options={affinityOptions}
                                    value={formState.spectralEmbedding.affinity}
                                    setValue={handleAlgorithmParams}
                                />
                            </FormControl>
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
