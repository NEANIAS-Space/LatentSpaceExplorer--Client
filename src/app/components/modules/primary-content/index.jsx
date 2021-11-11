import PropTypes from 'prop-types';
import PrimaryContentWrapper from './style';

const PrimaryContent = ({ children, padding }) => (
    <PrimaryContentWrapper padding={padding}>{children}</PrimaryContentWrapper>
);

PrimaryContent.propTypes = {
    children: PropTypes.element.isRequired,
    padding: PropTypes.bool,
};

PrimaryContent.defaultProps = {
    padding: false,
};

export default PrimaryContent;
