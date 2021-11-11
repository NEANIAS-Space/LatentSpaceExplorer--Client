import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { getReductions } from 'app/api/reduction';
import { getClusters } from 'app/api/cluster';
import getVisualization from 'app/api/visualization';
import ProjectorContext from 'app/contexts/projector/context';
import { FormControl, InputLabel, Button } from '@material-ui/core';
import Widget from 'app/components/elements/widget';
import AdvancedSelect from 'app/components/elements/selects/multiline';

const VisualizationForm = () => {
    const [session] = useSession();
    const router = useRouter();

    // projector context
    const { setGraphData } = useContext(ProjectorContext);

    // button's state
    const [disableButton, setDisableButton] = useState(true);

    // select's value
    const [reduction, setReduction] = useState('');
    const [cluster, setCluster] = useState('');

    // select's options
    const [reductionOptions, setReductionOptions] = useState([]);
    const [clusterOptions, setClusterOptions] = useState([]);

    // fetch select's data

    // select's data
    useEffect(() => {
        const fetchData = () => {
            getReductions(session.user.email, router.query.id)
                .then((reductions) => {
                    const options = reductions.map((option) => {
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

                    setReductionOptions(options);
                })
                .catch((error) => {
                    console.log(error);
                });

            getClusters(session.user.email, router.query.id)
                .then((clusters) => {
                    const options = clusters.map((option) => {
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

                    setClusterOptions(options);
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, [session, router]);

    // button state
    const handleButtonState = useEffect(() => {
        setDisableButton(!(reduction && cluster));
    }, [reduction, cluster]);

    // form's submit
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (reduction && cluster) {
            getVisualization(
                session.user.email,
                router.query.id,
                reduction,
                cluster,
            )
                .then((graphData) => {
                    setGraphData(graphData);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <Widget title="Visualization">
            <form
                onSubmit={handleFormSubmit}
                data-testid="VisualizationFormTest"
            >
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="reduction">Reduction</InputLabel>
                    <AdvancedSelect
                        name="reduction"
                        value={reduction}
                        options={reductionOptions}
                        setValue={setReduction}
                        onChange={handleButtonState}
                    />
                </FormControl>
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="cluster">Cluster</InputLabel>
                    <AdvancedSelect
                        name="cluster"
                        value={cluster}
                        options={clusterOptions}
                        setValue={setCluster}
                        onChange={handleButtonState}
                    />
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disableElevation
                    fullWidth
                    margin="dense"
                    disabled={disableButton}
                >
                    Show
                </Button>
            </form>
        </Widget>
    );
};

export default VisualizationForm;
