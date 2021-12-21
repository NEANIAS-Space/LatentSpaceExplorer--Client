import PropTypes from 'prop-types';
import { Slider as MUISlider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

const Slider = ({ name, value, step, min, max, setValue, onChange }) => {
    const marks = [
        { value: min, label: min },
        { value: max, label: max },
    ];

    const handleSliderChange = (_, newValue) => {
        const event = {
            target: {
                name,
                value: newValue,
                type: 'number',
            },
        };

        setValue(event);
        onChange();
    };

    const handleInputChange = (e) => {
        let newValue = Number(e.target.value);

        if (newValue < min) {
            newValue = min;
        } else if (newValue > max) {
            newValue = min;
        }

        const event = {
            target: {
                name,
                value: newValue,
                type: 'number',
            },
        };

        setValue(event);
        onChange();
    };

    return (
        <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="flex-start"
        >
            <Grid item xs={8}>
                <MUISlider
                    name={name}
                    value={value}
                    step={step}
                    min={min}
                    max={max}
                    marks={marks}
                    valueLabelDisplay="off"
                    onChange={handleSliderChange}
                />
            </Grid>
            <Grid item xs={4}>
                <Input
                    name={name}
                    value={value}
                    margin="dense"
                    onChange={handleInputChange}
                    component={TextField}
                    inputProps={{
                        step,
                        min,
                        max,
                        type: 'number',
                    }}
                />
            </Grid>
        </Grid>
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
