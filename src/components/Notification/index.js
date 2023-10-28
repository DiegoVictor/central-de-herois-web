import React from 'react';
import { Toast } from 'react-bootstrap';

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
