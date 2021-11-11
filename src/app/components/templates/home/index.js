import React from 'react';
import DefaultLayout from 'app/components/layouts/default-layout';
import PrimaryContent from 'app/components/modules/primary-content';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const HomeTemplate = () => (
    <DefaultLayout>
        <PrimaryContent padding>
            <>
                <Typography variant="h3" align="center">
                    Welcome to Latent Space Explorer
                </Typography>
                <br />
                <Typography variant="h5" align="center" paragraph>
                    In order to use this service follow the{' '}
                    <Link href="https://docs.neanias.eu/projects/s3-service/en/latest/services/latent_space_explorer.html">
                        guide
                    </Link>
                </Typography>
                <br />
                <Link href="/experiments">
                    <Button
                        component="button"
                        variant="contained"
                        color="secondary"
                        disableElevation
                        fullWidth
                        margin="dense"
                    >
                        Go to experiments page
                    </Button>
                </Link>
            </>
        </PrimaryContent>
    </DefaultLayout>
);

export default HomeTemplate;
