import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import UserContext from '~/contexts/User';
import { Menu } from '~/components/Menu';
import Theme, { Container } from '~/styles/theme';

export function Layout() {
  const { token } = useContext(UserContext);

  return (
    <Container>
      <Theme />
      {token && <Menu />}
      <Outlet />
    </Container>
  );
}
