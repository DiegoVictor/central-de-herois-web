import React, { useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { UserContext } from '~/contexts/User';

export function NavBar() {
  const { pathname } = useLocation();
  const { user } = useContext(UserContext);

  if (!user.token) {
    return null;
  }

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              className={{ active: pathname === '/dashboard' }}
              href="/dashboard"
            >
              Ameaças
            </Nav.Link>
            <Nav.Link
              className={{ active: pathname === '/heroes' }}
              href="/heroes"
            >
              Herois
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
