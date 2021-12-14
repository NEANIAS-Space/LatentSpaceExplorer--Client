import PropTypes from 'prop-types';
import { Button as MUIButton } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingButton = ({ text, color, isLoading, onClick }) => {
    const handleClick = () => {
        onClick();
    };

    return (
        <MUIButton
            variant="contained"
            color={color}
            disableElevation
            fullWidth
            margin="dense"
            onClick={handleClick}
        >
            {isLoading ? (
                <CircularProgress color="secondary" size={24} />
            ) : (
                text
            )}
        </MUIButton>
    );
};

LoadingButton.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
};

LoadingButton.defaultProps = {
    color: 'default',
    isLoading: false,
    onClick: () => {},
};

export default LoadingButton;
