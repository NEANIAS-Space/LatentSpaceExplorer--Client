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
                    relevant ways to group data and to support the definition
                    of novel classification schemes.
                    <br /><br />
                    You could find an overview of the service in the&nbsp;
                    <Link href="https://www.youtube.com/watch?v=-otNS3N2hyo">
                        intro video
                    </Link>
                    <br /><br />
                    In order to use the tool please follow the&nbsp;
                    <Link href="https://docs.neanias.eu/projects/s3-service/en/latest/services/latent_space_explorer.html">
                        documentation
                    </Link>
                    <br /><br />
                    If you want to play with the projector on some demo experiments you will find those on your experiment page
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
                        <br />
                        <br />
                        <Typography variant="body1" paragraph align="justify">
                            MNIST is a classic dataset for image classification.
                            It consists of 28x28 grayscale images of handwritten digits.
                            Analysing the dataset using the latent space explorer
                            allows to have a structured overview of the content of the dataset.
                            Clustering methods like dbscan could help to detect outliers
                            and clean the dataset.
                            The analysis could help to understand what the neural network
                            learn from the data and correct hidden bias.
                        </Typography>
                    </Grid>
                </Grid>
                <ZigZagLineSeparator />
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h3" align="left">
                            CelebA
                        </Typography>
                        <br />
                        <br />
                        <Typography variant="body1" paragraph align="justify">
                            CelebA is a dataset of over 200,000 celebrity images.
                            In this particular experiment we subsampled the dataset
                            to a smaller size of 10000 images.
                            <br />
                            The dataset is particularily familiar to all users
                            and so it is a good starting point for understanding the
                            latent space explorer.
                            <br />
                            CelebA it's a challenging dataset to be represented, because there
                            are a lot of visual features to understand: accessories, skin tone,
                            hair type, eyes, and so on.
                            <br />
                            Furthermore the background and the style of the photos could be
                            learned as a features. If the data are organized depending on the
                            background, then probably the neural network doesn't learn properly
                            what we're looking for.
                        </Typography>
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
                        <br />
                        <br />
                        <Typography variant="body1" paragraph align="justify">
                            EuroSAT is collection of images captured by European Space Agency satellites
                            using multiple instruments.
                            <br />
                            Images has a shape of 64x64 pixels and those present more than
                            3 standard RGB channels. 13 spectral bands from 443 nm to 2190 form a datacube.
                            <br />
                            This dataset gets closer to the final use case of the latent space explorer,
                            that was intended to explore astronomical images taken by non standard instruments.
                            <br />
                            It consists of 10 classes: Industrial Buildings, Residential Buildings, Annual Crop,
                            Permanent Crop, River, Sea/Lake, Herbaceous Vegetation, Highway, Pasture, and Forest.
                            <br />
                            Analysing the dataset using the latent space explorer could suggest new classification schemes.

                        </Typography>
                    </Grid>
                </Grid>
                <ZigZagLineSeparator />
            </>
        </PrimaryContent>
    </DefaultLayout>
);

export default HomeTemplate;
