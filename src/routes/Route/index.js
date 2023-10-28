import React, { useContext } from 'react';
import { Route, redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import UserContext from '~/contexts/User';

export function AuthRoute({
  privated,
  guest,
  element: Component,
  ...rest
}) {
  const context = useContext(UserContext);
  const Page = () => {
    if (!context.token) {
      if (privated) {
        return redirect("/");
      }
    }

    if (guest) {
      return redirect("/dashboard");
    }

    return <Component {...props} />;
  };

  return (
    <Route {...rest} element={Page} />
  );
}

AuthRoute.propTypes = {
  privated: PropTypes.bool,
  guest: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

AuthRoute.defaultProps = {
  privated: false,
  guest: false,
};
