import { createGlobalStyle } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0px;
    outline: 0px;
    padding: 0px;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background-color: #F5F5F5;
  }

  body, input, button {
    font-family: Roboto, sans-serif;
    font-size: 1rem !important;
  }
`;
