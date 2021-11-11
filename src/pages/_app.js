import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider as SessionProvider } from 'next-auth/client';
import Auth from 'app/utils/authorization';
import theme from 'styles/theme';

const App = ({ Component, pageProps }) => {
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <StylesProvider injectFirst>
                    <SessionProvider session={pageProps.session}>
                        {Component.auth ? (
                            <Auth>
                                <Component {...pageProps} />
                            </Auth>
                        ) : (
                            <Component {...pageProps} />
                        )}
                    </SessionProvider>
                </StylesProvider>
            </ThemeProvider>
        </>
    );
};

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.shape({
        session: PropTypes.shape({}),
    }).isRequired,
};

export default App;
