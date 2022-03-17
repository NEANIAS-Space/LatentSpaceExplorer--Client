import React from 'react';
import DefaultLayout from 'app/components/layouts/default-layout';
import PrimaryContent from 'app/components/modules/primary-content';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Image from 'next/image';
import ZigZagLineSeparator from 'app/components/elements/zigzig-line-separator';

const HomeTemplate = () => (
    <DefaultLayout>
        <PrimaryContent padding>
            <>
                <Typography variant="h2" align="center">
                    Welcome to Latent Space Explorer
                </Typography>
                <br />
                <Typography variant="body1" paragraph align="justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi
                    ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur.
                    <br />
                    <br />
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                </Typography>
                <Typography variant="h5" align="center" paragraph>
                    In order to use this service follow the{' '}
                    <Link href="https://docs.neanias.eu/projects/s3-service/en/latest/services/latent_space_explorer.html">
                        guide
                    </Link>
                </Typography>
                <Link href="/experiments" color="primary" underline="none">
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
                <ZigZagLineSeparator />
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3}>
                            <Box
                                position="relative"
                                width="100%"
                                height="0"
                                paddingBottom="80%"
                            >
                                <Image
                                    src="/mnist-cae.png"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h3" align="right">
                            MNIST
                        </Typography>
                        <Typography variant="body1" paragraph align="justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                            <br />
                            <br />
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                        </Typography>
                        <Link href="#">Download example</Link>
                    </Grid>
                </Grid>
                <ZigZagLineSeparator />
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h3" align="left">
                            CelebA
                        </Typography>
                        <Typography variant="body1" paragraph align="justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                            <br />
                            <br />
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                        </Typography>
                        <Link href="#">Download example</Link>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3}>
                            <Box
                                position="relative"
                                width="100%"
                                height="0"
                                paddingBottom="80%"
                            >
                                <Image
                                    src="/celeba-simclr.png"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                <ZigZagLineSeparator />
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3}>
                            <Box
                                position="relative"
                                width="100%"
                                height="0"
                                paddingBottom="80%"
                            >
                                <Image
                                    src="/eurosat-simclr.png"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h3" align="right">
                            EuroSAT
                        </Typography>
                        <Typography variant="body1" paragraph align="justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.
                            <br />
                            <br />
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                        </Typography>
                        <Link href="#">Download example</Link>
                    </Grid>
                </Grid>
                <ZigZagLineSeparator />
            </>
        </PrimaryContent>
    </DefaultLayout>
);

export default HomeTemplate;
