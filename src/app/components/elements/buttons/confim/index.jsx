import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import sleep from 'app/utils/chronos';

const ConfirmButton = ({ texts, colors, icon, onConfirm }) => {
    const waitingTime = 5; // seconds
    const [countdown, setCountdown] = useState(waitingTime);
    const [waiting, setWaiting] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const renderTooltip = () => {
        if (!waiting && !confirm) {
            return texts.default;
        }

        if (waiting) {
            return texts.confirm;
        }

        return texts.post;
    };

    const updateCountdown = () => {
        if (waiting && countdown > 0) {
            sleep(1000).then(() => {
                setCountdown(countdown - 1);
            });
        } else {
            setWaiting(false);
            setCountdown(waitingTime);
        }
    };

    const handleClick = () => {
        if (!confirm) {
            if (waiting) {
                setConfirm(true);
                setWaiting(false);
            } else {
                setWaiting(true);
            }
        }
    };

    const handleConfirm = () => {
        if (confirm) {
            onConfirm();
        }
    };

    useEffect(updateCountdown, [countdown, onConfirm, waiting]);
    useEffect(handleConfirm, [onConfirm, confirm]);

    return (
        <Tooltip title={renderTooltip()} arrow>
            <Avatar
                style={
                    !waiting && !confirm
                        ? { backgroundColor: colors.default }
                        : { backgroundColor: colors.confirm }
                }
                onClick={handleClick}
            >
                {!waiting && !confirm && icon && icon}
                {waiting && <>{countdown}</>}
                {confirm && (
                    <CircularProgress
                        size={24}
                        style={{ color: colors.post }}
                    />
                )}
            </Avatar>
        </Tooltip>
    );
};

ConfirmButton.propTypes = {
    texts: PropTypes.shape({
        default: PropTypes.string.isRequired,
        confirm: PropTypes.string.isRequired,
        post: PropTypes.string.isRequired,
    }).isRequired,
    colors: PropTypes.shape({
        default: PropTypes.string.isRequired,
        confirm: PropTypes.string.isRequired,
        post: PropTypes.string.isRequired,
    }).isRequired,
    icon: PropTypes.element,
    onConfirm: PropTypes.func,
};

ConfirmButton.defaultProps = {
    icon: null,
    onConfirm: () => {},
};

export default ConfirmButton;
