import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { Select as MUISelect } from '@material-ui/core';

const SimpleSelect = ({ id, options, value, setValue, onChange }) => {
    const renderOptions = () =>
        options.map((option) => (
            <MenuItem key={option.id} value={option.id} dense>
                {option.value}
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

SimpleSelect.propTypes = {
    id: PropTypes.string.isRequired,
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
