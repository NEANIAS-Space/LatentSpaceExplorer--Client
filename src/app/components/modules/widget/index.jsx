import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import WidgetWrapper from './style';

const Widget = ({ title, icon, children }) => (
    <WidgetWrapper>
        {title && (
            <Box mb={2}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="subtitle1" component="p">
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item>{icon && icon}</Grid>
                </Grid>
                <Divider />
            </Box>
        )}
        {children}
    </WidgetWrapper>
);

Widget.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.element,
    children: PropTypes.element.isRequired,
};

Widget.defaultProps = {
    title: '',
    icon: null,
};

export default Widget;
