import React from 'react';
import { Nav } from 'react-bootstrap';

import Link from '~/components/Link';
import { Container } from './styles';

export default function Menu() {
  return (
    <Container>
      <Nav.Item>
        <Link to="/dashboard">Ameaças</Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/heroes">Herois</Link>
      </Nav.Item>
    </Container>
  );
}
