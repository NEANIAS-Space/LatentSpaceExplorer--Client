import styled from 'styled-components';

const DefaultLayoutWrapper = styled.div`
    height: 100vh;
    display: grid;
    grid-template-rows: 64px auto;
    grid-template-columns: 15% auto 15%;
    // overflow: hidden;
    overflow-y: auto;
`;

export default DefaultLayoutWrapper;
