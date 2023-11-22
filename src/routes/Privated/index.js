import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserContext } from '~/contexts/User';

export function Privated({ element: Component }) {
  const { user } = useContext(UserContext);

  if (!user?.token) {
    return <Navigate to="/" />;
  }

  return <Component />;
}

Privated.propTypes = {
  element: PropTypes.func.isRequired,
};
