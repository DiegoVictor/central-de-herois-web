import React from 'react';

import { Routes } from './routes';
import Theme, { Container } from './styles/theme';

export function App() {
  return (
    <Container>
      <Theme />
      <Routes />
    </Container>
  );
}
