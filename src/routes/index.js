import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Login } from '~/pages/Login';
import { Dashboard } from '~/pages/Dashboard';
import { Heroes } from '~/pages/Heroes';
import { NavBar } from '~/components/NavBar';
import { UserProvider } from '~/contexts/User';
import { Guest } from './Guest';
import { Privated } from './Privated';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <NavBar />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: <Guest element={Login} />,
      },
      {
        path: '/dashboard',
        element: <Privated element={Dashboard} />,
      },
      {
        path: '/heroes',
        element: <Privated element={Heroes} />,
      },
    ],
  },
]);

export function Routes() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
