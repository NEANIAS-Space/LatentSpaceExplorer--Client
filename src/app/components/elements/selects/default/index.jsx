import PropTypes from 'prop-types';
import { Select as MaterialUISelect, MenuItem } from '@material-ui/core';

const Select = ({ name, value, options, setValue, onChange }) => {
    const renderOptions = () =>
        options.map((option) => (
            <MenuItem key={option.label} value={option.value} dense>
                {option.label}
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
            data-testid="SelectTest"
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
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
