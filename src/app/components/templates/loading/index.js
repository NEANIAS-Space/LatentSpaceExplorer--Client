import React from 'react';
import DefaultLayout from 'app/components/layouts/default-layout';
import PrimaryContent from 'app/components/modules/primary-content';
import Typography from '@material-ui/core/Typography';

const LoadingTemplate = () => (
    <DefaultLayout>
        <PrimaryContent padding>
            <Typography paragraph>Loading...</Typography>
        </PrimaryContent>
    </DefaultLayout>
);

export default LoadingTemplate;
