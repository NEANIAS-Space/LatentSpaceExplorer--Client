import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Select as MUISelect } from '@material-ui/core';
import { red, grey } from '@material-ui/core/colors';
import normalize from 'app/utils/strings';
import ConfirmButton from 'app/components/elements/buttons/confim';
import theme from 'styles/theme';

const AdvancedSelect = ({
    name,
    options,
    value,
    setValue,
    onChange,
    secondaryAction,
    onSecondaryAction,
}) => {
    const renderParams = (params) => {
        const stringParams = Object.keys(params)
            .map((key) => `${normalize(key)}=${params[key]}`)
            .join(' | ');

        return (
            <Typography
                component="div"
                variant="caption"
                color="textPrimary"
                noWrap
            >
                {stringParams}
            </Typography>
        );
    };

    const renderItem = (option) => (
        <ListItem key={option.id} value={option.id} button dense>
            <ListItemText
                primary={
                    <>
                        <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                        >
                            {normalize(option.algorithm)}
                        </Typography>
                        {option.components && (
                            <Typography
                                component="span"
                                variant="body1"
                                color="textSecondary"
                                noWrap
                            >
                                {` — ${option.components}D `}
                            </Typography>
                        )}
                    </>
                }
                secondary={
                    <>
                        {renderParams(
                            Object.keys(option.params).length !== 0 &&
                                option.params,
                        )}
                        <Typography
                            component="div"
                            variant="caption"
                            color="textSecondary"
                            noWrap
                        >
                            {option.datetime}
                        </Typography>
                    </>
                }
                secondaryTypographyProps={{ component: 'div' }}
            />
            {secondaryAction && option.id !== value && (
                <ListItemSecondaryAction>
                    <ConfirmButton
                        texts={{
                            default: 'Delete',
                            confirm: 'Click to confirm',
                            post: 'Deleting...',
                        }}
                        colors={{
                            default: theme.palette.secondary.main,
                            confirm: red[600],
                            post: grey[50],
                        }}
                        icon={<DeleteIcon color="primary" />}
                        onConfirm={() => {
                            onSecondaryAction(option.id);
                        }}
                    />
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );

    const renderOptions = () => options.map((option) => renderItem(option));

    const handleChange = (event) => {
        setValue(event);
        onChange();
    };

    return (
        <MUISelect
            label={name}
            name={name}
            value={value}
            onChange={handleChange}
        >
            {renderOptions()}
        </MUISelect>
    );
};

AdvancedSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            algorithm: PropTypes.string,
            components: PropTypes.int,
            params: PropTypes.shape({}),
            datetime: PropTypes.string,
        }),
    ),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setValue: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    secondaryAction: PropTypes.bool,
    onSecondaryAction: PropTypes.func,
};

AdvancedSelect.defaultProps = {
    options: [],
    onChange: () => {},
    secondaryAction: false,
    onSecondaryAction: () => {},
};

export default AdvancedSelect;
