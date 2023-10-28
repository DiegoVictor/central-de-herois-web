import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useField } from '@unform/core';

export function Select({ name, children, ...rest }) {
  const inputRef = useRef(null);

  const { fieldName, defaultValue = '', registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <select ref={inputRef} defaultValue={defaultValue} {...rest}>
      {children}
    </select>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
};
