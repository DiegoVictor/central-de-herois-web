import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import api from '~/services/api';
import { Heroes } from '~/pages/Heroes';
import { getLabel } from '~/helpers/HeroStatuses';
import factory from '../utils/factory';

const apiMock = new MockAdapter(api);

describe('Heroes page', () => {
  it('should be able to get the list of heroes', async () => {
    const heroes = await factory.attrsMany('Hero', 3);

    apiMock.onGet('heroes').reply(200, heroes);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);
    const { getByTestId, getByText } = render(
      <RouterProvider router={router} />
    );

    const [{ name }] = heroes;
    await waitFor(() => getByText(name));

    heroes.forEach((hero) => {
      expect(getByText(hero.name)).toBeInTheDocument();
      expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(hero.rank);
      expect(
        getByText(`${hero.latitude}, ${hero.longitude}`)
      ).toBeInTheDocument();
      expect(getByTestId(`hero_status_${hero._id}`)).toHaveTextContent(
        getLabel(hero.status)
      );
    });
  });

  it('should not be able to get the list of heroes', async () => {
    apiMock.onGet('heroes').networkError();

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);

    router.window.alert = jest.fn();

    render(<RouterProvider router={router} />);

    await waitFor(() => expect(router.window.alert).toHaveBeenCalled());

    expect(router.window.alert).toHaveBeenCalledWith(
      'Não foi possivel atualizar a lista de herois'
    );
  });

  it('should be able to remove an hero', async () => {
    const hero = await factory.attrs('Hero');

    apiMock.reset();
    apiMock
      .onGet('heroes')
      .replyOnce(200, [hero])
      .onGet('heroes')
      .reply(200, [])
      .onDelete(`/heroes/${hero._id}`)
      .reply(200);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);
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

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);

    router.window.alert = jest.fn();

    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => getByTestId(`hero_remove_${hero._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`hero_remove_${hero._id}`));
    });

    expect(router.window.alert).toHaveBeenCalledWith(
      'Não foi possivel remover o heroi, tente novamente!'
    );
  });

  it('should be able to store a new hero', async () => {
    const { _id, name, rank, latitude, longitude, status } =
      await factory.attrs('Hero');

    apiMock
      .onGet('heroes')
      .reply(200, [])
      .onPost('heroes')
      .reply(200, { _id, name, rank, latitude, longitude, status })
      .onGet('heroes')
      .reply(200, [{ _id, name, rank, latitude, longitude, status }]);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: latitude },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: longitude },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByTestId(`hero_${_id}`)).toBeInTheDocument();
  });

  it('should be able to cancel the hero creation', async () => {
    const { _id, name, rank, latitude, longitude, status } =
      await factory.attrs('Hero');

    apiMock.reset();
    apiMock
      .onGet('heroes')
      .reply(200, [])
      .onGet('heroes')
      .reply(200, [{ _id, name, rank, latitude, longitude, status }]);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });

    await act(async () => {
      fireEvent.click(getByTestId('cancel'));
    });

    expect(apiMock.history.post.length).toBe(0);
  });

  it('should not be able to store a new hero', async () => {
    const { name, rank, latitude, longitude, status } =
      await factory.attrs('Hero');

    apiMock.onGet('heroes').reply(200, []).onPost('heroes').reply(400);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);

    router.window.alert = jest.fn();

    const { getByTestId } = render(<RouterProvider router={router} />);

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: latitude },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: longitude },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(router.window.alert).toHaveBeenCalledWith(
      'Não foi possivel criar/atualizar o heroi, tente novamente!'
    );
  });

  it('should be able to edit an hero', async () => {
    const [hero, { name, rank, status, latitude, longitude }, ...rest] =
      await factory.attrsMany('Hero', 3);

    apiMock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onPut(`/heroes/${hero._id}`)
      .reply(200, { _id: hero._id, name, status, rank, latitude, longitude })
      .onGet('heroes')
      .reply(200, [
        {
          ...hero,
          name,
          rank,
          latitude,
          longitude,
          status,
        },
        ...rest,
      ]);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);

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
      target: { value: latitude },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: longitude },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(getByText(name)).toBeInTheDocument();
    expect(getByTestId(`hero_rank_${hero._id}`)).toHaveTextContent(rank);
    expect(getByText(`${latitude}, ${longitude}`)).toBeInTheDocument();
    expect(getByTestId(`hero_status_${hero._id}`)).toHaveTextContent(
      getLabel(status)
    );
  });

  it('should not be able to edit an hero', async () => {
    const [hero, { name, rank, status, latitude, longitude }, ...rest] =
      await factory.attrsMany('Hero', 3);

    apiMock
      .onGet('heroes')
      .reply(200, [hero, ...rest])
      .onPut(`/heroes/${hero._id}`)
      .reply(404);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Heroes />,
      },
    ]);

    router.window.alert = jest.fn();

    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => getByTestId(`hero_edit_${hero._id}`));

    await act(async () => {
      fireEvent.click(getByTestId(`hero_edit_${hero._id}`));
    });

    fireEvent.change(getByTestId('name'), {
      target: { value: name },
    });
    fireEvent.change(getByTestId('rank'), { target: { value: rank } });
    fireEvent.change(getByTestId('latitude'), {
      target: { value: latitude },
    });
    fireEvent.change(getByTestId('longitude'), {
      target: { value: longitude },
    });
    fireEvent.change(getByTestId('status'), {
      target: { value: status },
    });

    await act(async () => {
      fireEvent.click(getByTestId('submit'));
    });

    expect(router.window.alert).toHaveBeenCalledWith(
      'Não foi possivel criar/atualizar o heroi, tente novamente!'
    );
  });
});
