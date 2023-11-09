import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';

import UserContext from '~/contexts/User';
import { Link } from '~/components/Link';
import { Container } from './styles';

export function NavBar() {
  const { token } = useContext(UserContext);

  if (!token) {
    return null;
  }

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
