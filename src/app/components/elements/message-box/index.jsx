import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

const MessageBox = ({ message, severity, open, handleClose }) => (
    <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        open={open}
        onClose={handleClose}
        action={
            <>
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </>
        }
    >
        <Alert onClose={handleClose} severity={severity}>
            {message}
        </Alert>
    </Snackbar>
);

MessageBox.propTypes = {
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['info', 'success', 'warining', 'error']),
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

MessageBox.defaultProps = {
    severity: 'info',
};

export default MessageBox;
