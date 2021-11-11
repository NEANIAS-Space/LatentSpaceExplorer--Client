import styled from 'styled-components';
import theme from 'styles/theme';

const PrimaryContentWrapper = styled.div`
    grid-row: 2;
    grid-column: 2;
    padding: ${(props) =>
        props.padding ? `${theme.spacing(2)}px` : 'initial'};
    // background-color: ${theme.palette.grey[100]};
`;

export default PrimaryContentWrapper;
