import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSession, signIn } from 'next-auth/client';
import LoadingTemplate from 'app/components/templates/loading';

const Auth = ({ children }) => {
    const [session, loading] = useSession();
    const isUser = !!session?.user;

    useEffect(() => {
        if (loading) return; // Do nothing while loading
        if (!isUser) signIn(); // If not authenticated, force log in
    }, [isUser, loading]);

    if (isUser) {
        return children;
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <LoadingTemplate />;
};

Auth.propTypes = {
    children: PropTypes.shape({}).isRequired,
};

export default Auth;
