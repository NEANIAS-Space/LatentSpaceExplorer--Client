import React from 'react';
import Head from 'next/head';
import HomeTemplate from 'app/components/templates/home';

const HomePage = () => (
    <>
        <Head>
            <title>Homepage</title>
        </Head>
        <HomeTemplate />
    </>
);

HomePage.auth = false;

export default HomePage;
