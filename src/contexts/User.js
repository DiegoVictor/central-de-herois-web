import React, { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { setAuthHeader } from '~/services/api';

export const UserContext = createContext({});

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storageData = localStorage.getItem('iheroes');
    if (storageData) {
      return JSON.parse(storageData || '{}');
    }

    return {};
  });

  const context = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  useEffect(() => {
    localStorage.setItem('iheroes', JSON.stringify(user));
    setAuthHeader(user.token ? `Bearer ${user.token}` : null);
  }, [user]);

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
