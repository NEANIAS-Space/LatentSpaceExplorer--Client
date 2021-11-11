import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { FormControl, InputLabel, Typography } from '@material-ui/core';
import Widget from 'app/components/elements/widget';
import Select from 'app/components/elements/selects/default';
import Slider from 'app/components/elements/slider';
import LoadingButton from 'app/components/elements/loading-button';
import { postReduction } from 'app/api/reduction';
import sleep from 'app/utils/chronos';

const ReductionForm = () => {
    const [session] = useSession();
    const router = useRouter();

    // algorithm
    const [algorithm, setAlgorithm] = useState('pca');
    const algorithmOptions = [
        { label: 'PCA', value: 'pca' },
        { label: 'TSNE', value: 'tsne' },
        { label: 'UMAP', value: 'umap' },
    ];

    // components
    const [components, setComponents] = useState(2);
    const componentsOptions = [
        { label: 2, value: 2 },
        { label: 3, value: 3 },
    ];

    // tsne
    const [perplexity, setPerplexity] = useState(30);
    const [iterations, setIterations] = useState(1000);
    const [learningRate, setLearningRate] = useState(200);

    // umap
    const [neighbors, setNeighbors] = useState(15);
    const [minDistance, setMinDistance] = useState(0.1);

    // button
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

    // form's submit
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        let params = {};

        switch (algorithm) {
            case 'pca':
                break;
            case 'tsne':
                params = {
                    perplexity,
                    iterations,
                    learning_rate: learningRate,
                };
                break;
            case 'umap':
                params = {
                    neighbors,
                    min_distance: minDistance,
                };
                break;
            default:
                break;
        }

        postReduction(
            session.user.email,
            router.query.id,
            algorithm,
            components,
            params,
        ).then(() => sleep(1000).then(() => setButtonIsLoading(false)));
    };

    return (
        <Widget title="Reduction">
            <form onSubmit={handleFormSubmit} data-testid="ReductionFormTest">
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="algorithm">Algorithm</InputLabel>
                    <Select
                        name="algorithm"
                        value={algorithm}
                        options={algorithmOptions}
                        setValue={setAlgorithm}
                    />
                </FormControl>
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="components">Components</InputLabel>
                    <Select
                        name="components"
                        value={components}
                        options={componentsOptions}
                        setValue={setComponents}
                    />
                </FormControl>

                {/* T-SNE */}
                {algorithm === 'tsne' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Perplexity
                            </Typography>
                            <Slider
                                name="perplexity"
                                value={perplexity}
                                step={1}
                                min={5}
                                max={50}
                                setValue={setPerplexity}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Iterations
                            </Typography>
                            <Slider
                                name="iterations"
                                value={iterations}
                                step={1}
                                min={250}
                                max={5000}
                                setValue={setIterations}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Learning Rate
                            </Typography>
                            <Slider
                                name="learningRate"
                                value={learningRate}
                                step={1}
                                min={10}
                                max={1000}
                                setValue={setLearningRate}
                            />
                        </FormControl>
                    </>
                )}

                {/* UMAP */}
                {algorithm === 'umap' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">Neighbors</Typography>
                            <Slider
                                name="neighbors"
                                value={neighbors}
                                step={1}
                                min={2}
                                max={200}
                                setValue={setNeighbors}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Min. Distance
                            </Typography>
                            <Slider
                                name="minDistance"
                                value={minDistance}
                                step={0.01}
                                min={0.01}
                                max={0.99}
                                setValue={setMinDistance}
                            />
                        </FormControl>
                    </>
                )}

                <LoadingButton
                    text="Compute"
                    type="submit"
                    color="primary"
                    isLoading={buttonIsLoading}
                    onChange={() => {
                        setButtonIsLoading(true);
                    }}
                />
            </form>
        </Widget>
    );
};

export default ReductionForm;
