import React from 'react';
import Head from 'next/head';
import ProjectorTemplate from 'app/components/templates/projector';

const ProjectorPage = () => (
    <>
        <Head>
            <title>Projector</title>
        </Head>
        <ProjectorTemplate />
    </>
);

ProjectorPage.auth = true;

export default ProjectorPage;
