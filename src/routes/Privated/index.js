import React, { useContext } from 'react';
import { redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserContext } from '~/contexts/User';

export function Privated({ element: Component }) {
  const { token } = useContext(UserContext);

  if (!token) {
    return redirect('/');
  }

  return <Component />;
}

Privated.propTypes = {
  element: PropTypes.func.isRequired,
};
