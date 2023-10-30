import React, { useContext } from 'react';
import { Route, redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import UserContext from '~/contexts/User';

export function Guest({ element: Component }) {
  const { token } = useContext(UserContext);

  if (token) {
    return redirect('/dashboard');
  }

  return <Route element={Component} />;
}

Guest.propTypes = {
  element: PropTypes.func.isRequired,
};
