import PropTypes from 'prop-types';
import { Slider as MaterialUISlider } from '@material-ui/core';

const Slider = ({ name, value, step, min, max, setValue, onChange }) => {
    const handleChange = (_, v) => {
        setValue(v);
        onChange();
    };

    const marks = [
        { value: min, label: min },
        { value: max, label: max },
    ];

    return (
        <MaterialUISlider
            name={name}
            value={value}
            step={step}
            min={min}
            max={max}
            marks={marks}
            valueLabelDisplay="auto"
            onChange={handleChange}
            data-testid="SliderTest"
        />
    );
};

Slider.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    setValue: PropTypes.func.isRequired,
    onChange: PropTypes.func,
};

Slider.defaultProps = {
    onChange: () => {},
};

export default Slider;
