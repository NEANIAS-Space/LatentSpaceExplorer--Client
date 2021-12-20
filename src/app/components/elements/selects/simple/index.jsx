import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { Select as MUISelect } from '@material-ui/core';
import normalize from 'app/utils/formatter';

const SimpleSelect = ({ name, options, value, setValue, onChange }) => {
    const renderOptions = () =>
        options.map((option) => (
            <MenuItem key={option.id} value={option.id} dense>
                {normalize(option.value)}
            </MenuItem>
        ));

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

SimpleSelect.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
    ),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setValue: PropTypes.func.isRequired,
    onChange: PropTypes.func,
};

SimpleSelect.defaultProps = {
    options: [],
    onChange: () => {},
};

export default SimpleSelect;
