import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import api from '~/services/api';
import { Dashboard } from '~/pages/Dashboard';
import { Layout } from '~/components/Layout';
import factory from '../utils/factory';

const apiMock = new MockAdapter(api);

describe('Dashboard page', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem(
      JSON.stringify({
        token: faker.string.uuid(),
      })
    );
  });

  it('should be able to get a list of monsters fighting and defeated', async () => {
    const [fighting, defeated] = await Promise.all([
      factory.attrsMany('Monster', 3, {
        status: 'fighting',
      }),
      factory.attrsMany('Monster', 3, {
        status: 'defeated',
      }),
    ]);

    apiMock
      .onGet('monsters', {
        params: {
          status: 'fighting',
        },
      })
      .reply(200, fighting)
      .onGet('monsters', {
        params: {
          status: 'defeated',
        },
      })
      .reply(200, defeated);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
    ]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    const [
      {
        heroes: [{ name }],
      },
    ] = fighting;
    await waitFor(() => getByText(name));

    fighting.concat(defeated).forEach((monster) => {
      const [hero] = monster.heroes;

      expect(getByText(hero.name)).toBeInTheDocument();
      expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(hero.rank);
      expect(getByText(name)).toBeInTheDocument();
      expect(getByTestId(`monster_rank_${monster._id}`)).toHaveTextContent(
        monster.rank
      );
      expect(
        getByText(monster.location.coordinates.slice().reverse().join(', '))
      );
    });
  });

  it('should be able to set a monster as defeated', async () => {
    const monster = await factory.attrs('Monster', {
      status: 'fighting',
    });

    apiMock
      .onGet('monsters', {
        params: {
          status: 'fighting',
        },
      })
      .reply(200, [monster])
      .onGet('monsters', {
        params: {
          status: 'defeated',
        },
      })
      .reply(200, [])
      .onPut(`/monsters/${monster._id}/defeated`)
      .reply(200);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
    ]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => getByTestId(`monster_defeated_${monster._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`monster_defeated_${monster._id}`));
    });

    const [hero] = monster.heroes;
    fireEvent.change(getByTestId(`hero_status_${hero._id}`), {
      target: { value: 'resting' },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Ameaça atualizada com sucesso!')).toBeInTheDocument();
  });

  it('should not be able to set a monster as defeated', async () => {
    const monster = await factory.attrs('Monster', {
      status: 'fighting',
    });

    apiMock
      .onGet('monsters', {
        params: {
          status: 'fighting',
        },
      })
      .reply(200, [monster])
      .onGet('monsters', {
        params: {
          status: 'defeated',
        },
      })
      .reply(200, [])
      .onPut(`/monsters/${monster._id}/defeated`)
      .reply(404);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
    ]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => getByTestId(`monster_defeated_${monster._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`monster_defeated_${monster._id}`));
    });

    const [hero] = monster.heroes;
    fireEvent.change(getByTestId(`hero_status_${hero._id}`), {
      target: { value: 'resting' },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByText('Não foi possivel atualizar o status da ameaça!')
    ).toBeInTheDocument();
  });
});
