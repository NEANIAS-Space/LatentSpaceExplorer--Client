import { createTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

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
        MuiSlider: {
            root: {
                width: '90%',
                display: 'block',
                margin: '0 auto',
            },
        },
        MuiAvatar: {
            root: {
                cursor: 'pointer',
            },
        },
        MuiLink: {
            root: {
                color: blue[600],
            },
        },
        MuiTableCell: {
            stickyHeader: { backgroundColor: '#fff' },
        },
        MuiListItem: {
            secondaryAction: {
                paddingRight: defaultTheme.spacing(9),
            },
        },
    },
});

export default theme;
