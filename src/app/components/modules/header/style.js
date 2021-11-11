import styled from 'styled-components';
import { AppBar, Toolbar } from '@material-ui/core';
import theme from 'styles/theme';

const HeaderWrapper = styled(AppBar)`
    grid-row: 1;
    grid-column: 1/3;
    background-color: ${theme.palette.primary.main};
    border-bottom: 3px solid ${theme.palette.secondary.main};
`;

const ToolbarWrapper = styled(Toolbar)`
    justify-content: space-between;
`;

export { HeaderWrapper, ToolbarWrapper };
