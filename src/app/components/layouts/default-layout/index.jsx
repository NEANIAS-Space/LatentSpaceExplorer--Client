import PropTypes from 'prop-types';
import Header from 'app/components/modules/header';
import DefaultLayoutWrapper from './style';

const DefaultLayout = ({ children }) => (
    <DefaultLayoutWrapper>
        <Header />
        {children}
    </DefaultLayoutWrapper>
);

DefaultLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default DefaultLayout;
