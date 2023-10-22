import { createContext } from 'react';

const user = JSON.parse(localStorage.getItem('iheroes_user') || '{}');

export default createContext(user);
