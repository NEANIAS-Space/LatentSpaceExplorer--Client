import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { FormControl, InputLabel, Typography } from '@material-ui/core';
import Widget from 'app/components/elements/widget';
import Select from 'app/components/elements/selects/default';
import Slider from 'app/components/elements/slider';
import LoadingButton from 'app/components/elements/loading-button';
import { postCluster } from 'app/api/cluster';
import sleep from 'app/utils/chronos';

const ClusterForm = () => {
    const [session] = useSession();
    const router = useRouter();

    // algorithm
    const [algorithm, setAlgorithm] = useState('dbscan');
    const algorithmOptions = [
        { label: 'DBSCAN', value: 'dbscan' },
        { label: 'Affinity Propagation', value: 'affinity_propagation' },
        { label: 'KMeans', value: 'kmeans' },
        {
            label: 'Agglomerative Clustering',
            value: 'agglomerative_clustering',
        },
    ];

    // dbscan
    const [eps, setEps] = useState(0.5);
    const [minSamples, setMinSamples] = useState(5);

    // kmeans
    const [nClusters, setNClusters] = useState(8);

    // agglomerative clustering
    const [distanceThreshold, setDistanceThreshold] = useState(1);

    // button
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

    // form's submit
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        let params = {};

        switch (algorithm) {
            case 'dbscan':
                params = {
                    eps,
                    min_samples: minSamples,
                };
                break;
            case 'affinity_propagation':
                break;
            case 'kmeans':
                params = {
                    n_clusters: nClusters,
                };
                break;
            case 'agglomerative_clustering':
                params = {
                    distance_threshold: distanceThreshold,
                };
                break;
            default:
                break;
        }

        postCluster(
            session.user.email,
            router.query.id,
            algorithm,
            params,
        ).then(() => sleep(1000).then(() => setButtonIsLoading(false)));
    };

    return (
        <Widget title="Cluster">
            <form onSubmit={handleFormSubmit} data-testid="ClusterFormTest">
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="clusterAlgorithm">Algorithm</InputLabel>
                    <Select
                        name="algorithm"
                        value={algorithm}
                        options={algorithmOptions}
                        setValue={setAlgorithm}
                    />
                </FormControl>

                {/* DBSCAN */}
                {algorithm === 'dbscan' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">EPS</Typography>
                            <Slider
                                name="eps"
                                value={eps}
                                step={0.01}
                                min={0.01}
                                max={0.99}
                                setValue={setEps}
                            />
                        </FormControl>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Min. Samples
                            </Typography>
                            <Slider
                                name="minSamples"
                                value={minSamples}
                                step={1}
                                min={1}
                                max={300}
                                setValue={setMinSamples}
                            />
                        </FormControl>
                    </>
                )}

                {/* KMeans */}
                {algorithm === 'kmeans' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Number of clusters
                            </Typography>
                            <Slider
                                name="nClusters"
                                value={nClusters}
                                step={1}
                                min={1}
                                max={100}
                                setValue={setNClusters}
                            />
                        </FormControl>
                    </>
                )}

                {/* Agglomerative Clustering */}
                {algorithm === 'agglomerative_clustering' && (
                    <>
                        <FormControl margin="dense" fullWidth>
                            <Typography variant="caption">
                                Distance Threshold
                            </Typography>
                            <Slider
                                name="distanceThreshold"
                                value={distanceThreshold}
                                step={1}
                                min={1}
                                max={100}
                                setValue={setDistanceThreshold}
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

export default ClusterForm;
