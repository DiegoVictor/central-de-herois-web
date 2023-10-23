import React from 'react';
import PropTypes from 'prop-types';

import { Anchor } from './styles';

export default function Link({ children, to }) {
  return (
    <Anchor to={to}>
      {({ isActive }) => (
        <div className={isActive ? 'active' : ''}>{children}</div>
      )}
    </Anchor>
  );
}

Link.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
