import React from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import { AuthRoute } from '~/routes/Route';
import { Login } from '~/pages/Login';
import { Dashboard } from '~/pages/Dashboard';
import { Heroes } from '~/pages/Heroes';
import { Layout } from '~/components/Layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <AuthRoute index guest element={Login} />
      <AuthRoute path="/dashboard" privated element={Dashboard} />
      <AuthRoute path="/heroes" privated element={Heroes} />
    </Route>
  )
);

export function Navigation() {
  return <RouterProvider router={router} />;
}
