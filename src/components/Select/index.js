import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useField } from '@unform/core';

export function Select({ name, children, ...rest }) {
  const selectRef = useRef(null);

  const { fieldName, defaultValue = '', registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <select ref={selectRef} defaultValue={defaultValue} {...rest}>
      {children}
    </select>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
};
