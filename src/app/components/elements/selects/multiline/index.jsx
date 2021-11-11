import PropTypes from 'prop-types';
import {
    Select as MaterialUISelect,
    MenuItem,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core';

const Select = ({ name, value, options, setValue, onChange }) => {
    const renderParams = (option) => {
        const { params = {} } = option;

        if (Object.keys(params).length !== 0) {
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
        }

        return null;
    };

    const renderOptions = () =>
        options.map((option) => (
            <MenuItem key={option.id} value={option.id} dense>
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
                                {renderParams(option)}
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
            </MenuItem>
        ));

    const handleChange = (event) => {
        setValue(event.target.value);
        onChange();
    };

    return (
        <MaterialUISelect
            name={name}
            value={value}
            onChange={handleChange}
            label={name}
            labelId={name}
            data-testid="MultilineSelectTest"
        >
            {renderOptions()}
        </MaterialUISelect>
    );
};

Select.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            algorithm: PropTypes.string,
            components: PropTypes.int,
            params: PropTypes.shape({}),
            datetime: PropTypes.string,
        }),
    ),
    setValue: PropTypes.func.isRequired,
    onChange: PropTypes.func,
};

Select.defaultProps = {
    onChange: () => {},
    options: [],
};

export default Select;
