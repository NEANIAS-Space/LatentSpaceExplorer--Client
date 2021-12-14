import styled from 'styled-components';
import theme from 'styles/theme';

const SideBarWrapper = styled.div`
    grid-row: 2;
    grid-column: ${(props) => props.column};
    background-color: ${theme.palette.grey[200]};
    padding: ${theme.spacing(2)}px;
    overflow-y: auto;
`;

export default SideBarWrapper;
