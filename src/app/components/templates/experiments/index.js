import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import DeleteIcon from '@material-ui/icons/Delete';
import { red, grey } from '@material-ui/core/colors';
import DefaultLayout from 'app/components/layouts/default-layout';
import PrimaryContent from 'app/components/modules/primary-content';
import MessageBox from 'app/components/elements/message-box';
import ConfirmButton from 'app/components/elements/buttons/confim';
import { getExperiments, deleteExperiment } from 'app/api/experiment';
import theme from 'styles/theme';

const ExperimentTemplate = () => {
    const [session] = useSession();

    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [experiments, setExperiments] = useState([]);

    const userId = session.user.email;

    const handleCloseMessageBox = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessageBox(false);
    };

    const renderMessageBox = () => (
        <MessageBox
            message={errorMessage}
            severity="error"
            open={openMessageBox}
            handleClose={handleCloseMessageBox}
        />
    );

    const fetchExperiments = () => {
        getExperiments(userId)
            .then((response) => {
                setExperiments(response.data);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const handleDeleteExperiment = (experimentId) => {
        deleteExperiment(userId, experimentId)
            .then(() => {
                const options = experiments.filter(
                    (experiment) => experiment.id !== experimentId,
                );
                setExperiments(options);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    const renderTableRow = () =>
        experiments.map((experiment) => (
            <TableRow key={experiment.id}>
                <TableCell>
                    <Link
                        href={`/projector/${encodeURIComponent(experiment.id)}`}
                    >
                        {experiment.metadata.name}
                    </Link>
                </TableCell>
                <TableCell align="center">
                    {experiment.metadata.image.dim} x{' '}
                    {experiment.metadata.image.dim}
                </TableCell>
                <TableCell align="center">
                    {Object.keys(experiment.metadata.image.channels.map).length}
                </TableCell>
                <TableCell align="center">
                    {JSON.stringify(experiment.metadata.image.channels.preview)}
                </TableCell>
                <TableCell align="center">
                    {experiment.metadata.architecture.name}
                </TableCell>
                <TableCell align="center">
                    {experiment.metadata.architecture.latent_dim}
                </TableCell>
                <TableCell align="center">
                    <ConfirmButton
                        texts={{
                            default: 'Delete',
                            confirm: 'Click to confirm',
                            post: 'Deleting...',
                        }}
                        colors={{
                            default: theme.palette.secondary.main,
                            confirm: red[600],
                            post: grey[50],
                        }}
                        icon={<DeleteIcon color="primary" />}
                        onConfirm={() => handleDeleteExperiment(experiment.id)}
                    />
                </TableCell>
            </TableRow>
        ));

    useEffect(fetchExperiments, [userId]);

    return (
        <DefaultLayout>
            <PrimaryContent padding>
                <>
                    <Typography variant="h3" align="center">
                        Experiments list
                    </Typography>
                    <br />
                    <TableContainer
                        component={Paper}
                        style={{ maxHeight: '70vh' }}
                    >
                        <Table stickyHeader aria-label="table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">
                                        Image size
                                    </TableCell>
                                    <TableCell align="center">
                                        Channels num.
                                    </TableCell>
                                    <TableCell align="center">
                                        Preview
                                    </TableCell>
                                    <TableCell align="center">
                                        Architecture
                                    </TableCell>
                                    <TableCell align="center">
                                        Latent dim.
                                    </TableCell>
                                    <TableCell align="center">Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {experiments && renderTableRow()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <Typography variant="caption" align="center">
                        {experiments.length} experiments
                    </Typography>
                    {renderMessageBox()}
                </>
            </PrimaryContent>
        </DefaultLayout>
    );
};

export default ExperimentTemplate;
