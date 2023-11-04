import React, { useEffect, useState, useCallback } from 'react';
import { Table, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getLabel } from '~/helpers/HeroStatuses';
import api from '~/services/api';
import { googleMapUrl } from '~/utils/constants';
import { Container } from './styles';
import { FormModal } from './FormModal';

export function Heroes() {
  const [heroes, setHeroes] = useState([]);
  const [formData, setFormData] = useState(null);

  const handleRemoveHero = useCallback(
    async (id) => {
      try {
        await api.delete(`/heroes/${id}`);

        setHeroes(heroes.filter(({ _id }) => _id !== id));
      } catch (err) {
        alert('Não foi possivel remover o heroi, tente novamente!');
      }
    },
    [heroes]
  );

  const handleHeroForm = useCallback(
    ({ _id, name, rank, status, latitude, longitude }) => {
      (async () => {
        if (_id) {
          try {
            const response = await api.put(`/heroes/${_id}`, {
              name,
              rank,
              status,
              latitude,
              longitude,
            });

            setHeroes(
              heroes.map((h) => {
                if (h._id === _id) {
                  return response.data;
                }
                return h;
              })
            );
          } catch (err) {
            alert('Não foi possivel atualizar o heroi, tente novamente!');
          }
        } else {
          try {
            const response = await api.post('heroes', {
              name,
              rank,
              status,
              latitude,
              longitude,
            });

            setHeroes([...heroes, response.data]);
          } catch (err) {
            alert('Não foi possivel criar o heroi, tente novamente!');
          }
        }
        setFormData(null);
      })();
    },
    [heroes]
  );

  useEffect(() => {
    (async () => {
      const { data } = await api.get('heroes');

      setHeroes(
        data.map(({ coordinates: [longitude, latitude], ...props }) => ({
          ...props,
          latitude,
          longitude,
        }))
      );
    })();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <div className="text-right">
            <Button data-testid="new" onClick={() => setFormData({})} size="sm">
              Novo
            </Button>
          </div>
          <Table hover striped size="sm">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Rank</th>
                <th>Localização</th>
                <th>Status</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {heroes.map((hero) => (
                <tr key={hero._id} data-testid={`hero_${hero._id}`}>
                  <td>{hero.name}</td>
                  <td data-testid={`hero_rank_${hero._id}`}>{hero.rank}</td>
                  <td>
                    <Link
                      to={`${googleMapUrl + hero.location.coordinates[1]},${
                        hero.location.coordinates[0]
                      }`}
                      target="_blank"
                    >
                      {hero.location.coordinates.slice().reverse().join(', ')}
                    </Link>
                  </td>
                  <td data-testid={`hero_status_${hero._id}`}>
                    {getLabel(hero.status)}
                  </td>
                  <td className="text-right">
                    <ButtonGroup>
                      <Button
                        data-testid={`hero_edit_${hero._id}`}
                        size="sm"
                        onClick={() => {
                          setFormData(hero);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        data-testid={`hero_remove_${hero._id}`}
                        disabled={hero.status === 'fighting'}
                        size="sm"
                        onClick={() => {
                          handleRemoveHero(hero._id);
                        }}
                      >
                        Remover
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {formData && (
            <FormModal
              formData={formData}
              handleHeroForm={handleHeroForm}
              onHide={() => setFormData(null)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
