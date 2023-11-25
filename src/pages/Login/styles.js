import styled from 'styled-components';

export const Box = styled.div`
  margin: auto;
  max-width: 340px;
  text-align: center;
  width: 100%;

  ::placeholder {
    opacity: 0.5;
  }

  input {
    margin: 0px;
    height: 50px;
    width: 100%;
  }

  button {
    height: 50px;
  }
`;
