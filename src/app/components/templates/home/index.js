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
                    Latent Space Explorer (LSE) support analysis of image datasets 
                    via unsupervised machine learning methods. It allows to extract 
                    a compact representation from data by representation learning 
                    models (e.g. autoencoders). The information extracted can be 
                    then visualized using the projector. The latter allows visualizing the data in a
                    2D or 3D space in an interactive fashion. The system then 
                    allows performing clustering algorithms to detect potentially
                    relevant ways to group images and to support the definition 
                    of novel classification schemes.
                    <br />
                    <br />
                    In order to use the tool please follow the&nbsp;
                    <Link href="https://docs.neanias.eu/projects/s3-service/en/latest/services/latent_space_explorer.html">
                        documentation
                    </Link>
                    <br />
                    To produce representations please use&nbsp;
                    <Link href="https://gitlab.neanias.eu/s3-service/latent-space-explorer/generator">
                        latent space generator
                    </Link>
                    <br />
                    If you want to play with the projector on some demo experiments,
                    you could check the ones below.
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
                            MNIST is a classic dataset for image classification.
                            It consists of 28x28 grayscale images of handwritten digits.
                            Analysing the dataset using the latent space explorer
                            allows to detect non trivial features in the dataset.
                        </Typography>
                        <Link href="https://files.neanias.eu/s/td8nH8AdCAsPiWY">Download example</Link>
                    </Grid>
                </Grid>
                <ZigZagLineSeparator />
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h3" align="left">
                            CelebA
                        </Typography>
                        <Typography variant="body1" paragraph align="justify">
                            CelebA is a dataset of over 200,000 celebrity images.
                            In this particular experiment we subsampled the dataset
                            to a smaller size of 10000 images.
                            The dataset is particularily familiar to all users
                            and so it is a good starting point for understanding the
                            latent space explorer.
                        </Typography>
                        <Link href="https://files.neanias.eu/s/7rCESLoTFRiCfij">Download example</Link>
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
                            EuroSAT is a satellite image dataset.
                            It consists of images of the European Space Agency satellites.
                            The peculiarity of that dataset is that has 13 channels
                            (RGB, NIR, SWIR1, SWIR2, ...).
                            Analysing the dataset using the latent space explorer
                            
                        </Typography>
                        <Link href="https://files.neanias.eu/s/aXtYRikD8XpaGad">Download example</Link>
                    </Grid>
                </Grid>
                <ZigZagLineSeparator />
            </>
        </PrimaryContent>
    </DefaultLayout>
);

export default HomeTemplate;
