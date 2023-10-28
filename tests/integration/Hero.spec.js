import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import factory from '../utils/factory';
import api from '~/services/api';
import { Heroes } from '~/pages/Heroes';
import { getLabel } from '~/helpers/HeroStatuses';
import { Layout } from '~/components/Layout';

const apiMock = new MockAdapter(api);

describe('Heroes page', () => {
  it('should be able to get a list of heroes', async () => {
    const heroes = await factory.attrsMany('Hero', 3);

    apiMock.onGet('heroes').reply(200, heroes);

    const router = createMemoryRouter([{
      path:'/',
      element: <Heroes />
    }]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    const [{ name }] = heroes;
    await waitFor(() => getByText(name));

    heroes.forEach(hero => {
      expect(getByText(hero.name)).toBeInTheDocument();
      expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(hero.rank);
      expect(
        getByText(
          hero.location.coordinates
            .slice()
            .reverse()
            .join(', ')
        )
      ).toBeInTheDocument();
      expect(getByTestId(`hero_status_${hero._id}`)).toHaveTextContent(
        getLabel(hero.status)
      );
    });
  });

  it('should be able to remove an hero', async () => {
    const hero = await factory.attrs('Hero');

    apiMock
      .onGet('heroes')
      .reply(200, [hero])
      .onDelete(`/heroes/${hero._id}`)
      .reply(200);

    const router = createMemoryRouter([{
      path:'/',
      element: <Layout />,
      children: [{
        index: true,
        element: <Heroes />
      }]
    }]);
    const { getByTestId, queryByTestId } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => getByTestId(`hero_remove_${hero._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`hero_remove_${hero._id}`));
    });

    expect(queryByTestId(`hero_${hero._id}`)).not.toBeInTheDocument();
  });

  it('should not be able to remove an hero', async () => {
    const [hero, ...rest] = await factory.attrsMany('Hero', 3);

    apiMock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onDelete(`/heroes/${hero._id}`)
      .reply(404);

    const router = createMemoryRouter([{
      path:'/',
      element: <Layout />,
      children: [{
        index: true,
        element: <Heroes />
      }]
    }]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => getByTestId(`hero_remove_${hero._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`hero_remove_${hero._id}`));
    });

    expect(
      getByText('Não foi possivel remover o heroi, tente novamente!')
    ).toBeInTheDocument();
  });

  it('should be able to store a new hero', async () => {
    const { _id, name, rank, location, status } = await factory.attrs('Hero');

    apiMock
      .onGet('heroes')
      .reply(200, [])
      .onPost('heroes')
      .reply(200, { _id, name, rank, location, status });

    const router = createMemoryRouter([{
      path:'/',
      element: <Layout />,
      children: [{
        index: true,
        element: <Heroes />
      }]
    }]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Heroi cadastrado com sucesso!')).toBeInTheDocument();
    expect(getByTestId(`hero_${_id}`)).toBeInTheDocument();
  });

  it('should not be able to store a new hero', async () => {
    const { name, rank, location, status } = await factory.attrs('Hero');

    apiMock
      .onGet('heroes')
      .reply(200, [])
      .onPost('heroes')
      .reply(400);

    const router = createMemoryRouter([{
      path:'/',
      element: <Layout />,
      children: [{
        index: true,
        element: <Heroes />
      }]
    }]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByText('Não foi possivel criar o heroi, tente novamente!')
    ).toBeInTheDocument();
  });

  it('should be able to edit an hero', async () => {
    const [
      hero,
      { name, rank, status, location },
      ...rest
    ] = await factory.attrsMany('Hero', 3);

    apiMock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onPut(`/heroes/${hero._id}`)
      .reply(200, { _id: hero._id, name, status, rank, location });

    const router = createMemoryRouter([{
      path:'/',
      element: <Layout />,
      children: [{
        index: true,
        element: <Heroes />
      }]
    }]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => getByTestId(`hero_edit_${hero._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`hero_edit_${hero._id}`));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText('Heroi atualizado com sucesso!')).toBeInTheDocument();
    expect(getByText(name)).toBeInTheDocument();
    expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(rank);
    expect(
      getByText(
        location.coordinates
          .slice()
          .reverse()
          .join(', ')
      )
    ).toBeInTheDocument();
    expect(getByTestId(`hero_status_${hero._id}`)).toHaveTextContent(
      getLabel(status)
    );
  });

  it('should not be able to edit an hero', async () => {
    const [
      hero,
      { name, rank, status, location },
      ...rest
    ] = await factory.attrsMany('Hero', 3);

    apiMock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onPut(`/heroes/${hero._id}`)
      .reply(404);

    const router = createMemoryRouter([{
      path:'/',
      element: <Layout />,
      children: [{
        index: true,
        element: <Heroes />
      }]
    }]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => getByTestId(`hero_edit_${hero._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`hero_edit_${hero._id}`));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: location.coordinates[1] },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: location.coordinates[0] },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(
      getByText('Não foi possivel atualizar o heroi, tente novamente!')
    ).toBeInTheDocument();
  });
});
