import PropTypes from 'prop-types';
import { Button as MaterialUIButton } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingButton = ({ text, type, color, isLoading, onChange }) => {
    const handleChange = () => {
        onChange();
    };

    return (
        <MaterialUIButton
            type={type}
            variant="contained"
            color={color}
            disableElevation
            fullWidth
            margin="dense"
            onClick={handleChange}
            data-testid="LoadingButtonTest"
        >
            {isLoading ? (
                <CircularProgress color="secondary" size={24} />
            ) : (
                text
            )}
        </MaterialUIButton>
    );
};

LoadingButton.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
    onChange: PropTypes.func,
};

LoadingButton.defaultProps = {
    type: 'button',
    color: 'default',
    isLoading: false,
    onChange: () => {},
};

export default LoadingButton;
