import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Select as MUISelect } from '@material-ui/core';

const AdvancedSelect = ({ id, options, value, setValue, onChange }) => {
    const renderParams = (params) => {
        const stringParams = Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
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
        <ListItem component="div" disableGutters dense>
            <ListItemText
                primary={
                    <>
                        <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                        >
                            {option.algorithm}
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
        </ListItem>
    );

    const renderOptions = () =>
        options.map((option) => (
            <MenuItem key={option.id} value={option.id} dense>
                {renderItem(option)}
            </MenuItem>
        ));

    const handleChange = (event) => {
        setValue(event.target.value);
        onChange();
    };

    return (
        <MUISelect
            label={id}
            labelId={id}
            value={value}
            onChange={handleChange}
        >
            {renderOptions()}
        </MUISelect>
    );
};

AdvancedSelect.propTypes = {
    id: PropTypes.string.isRequired,
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
};

AdvancedSelect.defaultProps = {
    options: [],
    onChange: () => {},
};

export default AdvancedSelect;
