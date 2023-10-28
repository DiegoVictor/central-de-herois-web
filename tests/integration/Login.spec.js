import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import api from '~/services/api';
import factory from '../utils/factory';
import Login from '~/pages/Login';

const apiMock = new MockAdapter(api);

const mockRedirect = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    redirect: (to) => mockRedirect(to)
  }
})

describe('Login page', () => {
  beforeEach(async () => {
    localStorage.clear();
  });

  it('should be able to login', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = await factory.attrs('User');
    const token = faker.string.uuid();

    apiMock.onPost('sessions').reply(200, { user, token });

    const router = createMemoryRouter([{
      path:'/',
      element: <Login />
    }]);
    const { getByTestId } = render(
      <RouterProvider router={router} />
    );

    fireEvent.change(getByTestId('email'), {
      target: { value: email },
    });

    fireEvent.change(getByTestId('password'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(localStorage.getItem('iheroes_user')).toBe(
      JSON.stringify({
        user,
        token,
      })
    );
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });

  it('should be able to fail in validation', async () => {
    const email = faker.lorem.word();
    const password = faker.internet.password();

    const router = createMemoryRouter([{
      path:'/',
      element: <Login />
    }]);
    const { getByTestId, getByText  } = render(
      <RouterProvider router={router} />
    );

    fireEvent.change(getByTestId('email'), {
      target: { value: email },
    });

    fireEvent.change(getByTestId('password'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Email inválido')).toBeInTheDocument();
  });

  it('should not be able to login', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    apiMock.onPost('sessions').reply(400);

    const router = createMemoryRouter([{
      path:'/',
      element: <Login />
    }]);

    router.window.alert = jest.fn();

    const { getByTestId  } = render(
      <RouterProvider router={router} />
    );

    fireEvent.change(getByTestId('email'), {
      target: { value: email },
    });

    fireEvent.change(getByTestId('password'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(router.window.alert).toHaveBeenCalledWith(
      'Oops! Alguma coisa deu errado, tente novamente!'
    );
  });
});
