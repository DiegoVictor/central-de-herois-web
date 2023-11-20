import React, { useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { UserContext } from '~/contexts/User';

export function NavBar() {
  const { token } = useContext(UserContext);

  if (!token) {
    return null;
  }

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Ameaças</Nav.Link>
            <Nav.Link href="/heroes">Herois</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
