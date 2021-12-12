import { createTheme } from '@material-ui/core/styles';

// Default theme istance
const defaultTheme = createTheme();

// Custom theme istance
const theme = createTheme({
    palette: {
        primary: {
            main: '#404040',
        },
        secondary: {
            main: '#fdc50f',
        },
    },
    overrides: {
        MuiFormControl: {
            marginDense: {
                marginBottom: defaultTheme.spacing(2),
            },
        },
        // MuiLink: {
        //     root: {
        //         cursor: 'pointer',
        //     },
        // },
    },
});

export default theme;
