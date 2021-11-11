import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import DefaultLayout from 'app/components/layouts/default-layout';
import PrimaryContent from 'app/components/modules/primary-content';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Link from '@material-ui/core/Link';
import { getExperiments, deleteExperiment } from 'app/api/experiment';

const ExperimentTemplate = () => {
    const [session] = useSession();

    const [experiments, setExperiments] = useState([]);

    const fetchData = () => {
        getExperiments(session.user.email)
            .then((options) => {
                setExperiments(options);
            })
            .catch((error) => console.log(error));
    };

    useEffect(fetchData, [session]);

    const handleDeleteExperiment = (experimentId) => {
        deleteExperiment(session.user.email, experimentId)
            .then(fetchData)
            .catch((error) => console.log(error));
    };

    return (
        <DefaultLayout>
            <PrimaryContent padding>
                <>
                    <Typography variant="h3" align="center">
                        Experiments list
                    </Typography>
                    <br />
                    <TableContainer component={Paper}>
                        <Table aria-label="table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">
                                        Image Size
                                    </TableCell>
                                    <TableCell align="center">
                                        Image Channels
                                    </TableCell>
                                    <TableCell align="center">
                                        Preview Image
                                    </TableCell>
                                    <TableCell align="center">
                                        Architecture Name
                                    </TableCell>
                                    <TableCell align="center">
                                        Latent Dim.
                                    </TableCell>
                                    <TableCell align="center">Delete</TableCell>
                                    <TableCell align="center">Show</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {experiments &&
                                    Array.isArray(experiments) &&
                                    experiments.map((experiment) => (
                                        <TableRow key={experiment.id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                align="center"
                                            >
                                                {experiment.id}
                                            </TableCell>
                                            <TableCell align="center">
                                                {experiment.metadata.name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {experiment.metadata.image.dim}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    experiment.metadata.image
                                                        .channels
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {JSON.stringify(
                                                    experiment.metadata.image
                                                        .preview,
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    experiment.metadata
                                                        .architecture.name
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    experiment.metadata
                                                        .architecture.latent_dim
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link
                                                    onClick={() =>
                                                        handleDeleteExperiment(
                                                            experiment.id,
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </Link>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link
                                                    href={`/projector/${encodeURIComponent(
                                                        experiment.id,
                                                    )}`}
                                                >
                                                    <VisibilityIcon />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            </PrimaryContent>
        </DefaultLayout>
    );
};

export default ExperimentTemplate;
