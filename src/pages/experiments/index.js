import Head from 'next/head';
import ExperimentTemplate from 'app/components/templates/experiments';

const ExperimentPage = () => (
    <>
        <Head>
            <title>Experiments</title>
        </Head>
        <ExperimentTemplate />
    </>
);

ExperimentPage.auth = true;

export default ExperimentPage;
