import React, { useContext } from 'react';
import { Route, redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import UserContext from '~/contexts/User';

export function Privated({ element: Component }) {
  const { token } = useContext(UserContext);

  if (!token) {
    return redirect('/');
  }

  return <Route element={Component} />;
}

Privated.propTypes = {
  element: PropTypes.func.isRequired,
};
