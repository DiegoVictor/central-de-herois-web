import React from 'react';
import { Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';

export function Notification({ title, message, ...rest }) {
  return (
    <Toast animation={false} {...rest}>
      <Toast.Header>
        <strong className="mr-auto">{title}</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
