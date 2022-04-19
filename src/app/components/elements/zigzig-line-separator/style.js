import styled from 'styled-components';
import theme from 'styles/theme';

const ZigZagLineSeparatorWrapper = styled.div`
    height: 30px;
    width: 100%;
    background: linear-gradient(135deg, #fafafa 35%, transparent 25%) -15px 0,
        linear-gradient(225deg, #fafafa 35%, transparent 25%) -15px 0,
        linear-gradient(315deg, #fafafa 35%, transparent 25%),
        linear-gradient(45deg, #fafafa 35%, transparent 25%);
    background-size: 30px 30px;
    background-color: ${theme.palette.primary.main};
    margin: 50px 0;
    opacity: 20%;
`;

export default ZigZagLineSeparatorWrapper;
