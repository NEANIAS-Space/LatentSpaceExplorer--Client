import PropTypes from 'prop-types';
import { Typography, Divider, Box } from '@material-ui/core';
import WidgetWrapper from './style';

const Widget = ({ children, title }) => (
    <WidgetWrapper>
        {title && (
            <Box mb={2}>
                <Typography variant="subtitle1" component="p">
                    {title}
                </Typography>
                <Divider />
            </Box>
        )}
        {children}
    </WidgetWrapper>
);

Widget.propTypes = {
    children: PropTypes.element.isRequired,
    title: PropTypes.string,
};

Widget.defaultProps = {
    title: '',
};

export default Widget;
