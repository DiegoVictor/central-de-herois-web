import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import api from '~/services/api';
import { Container } from './styles';
import { FormModal } from './FormModal';
import { HeroesTable } from './HeroesTable';

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

      setHeroes(data);
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
          <HeroesTable
            heroes={heroes}
            handleRemoveHero={handleRemoveHero}
            setFormData={setFormData}
          />
          (
          <FormModal
            formData={formData}
            handleHeroForm={handleHeroForm}
            onHide={() => setFormData(null)}
          />
        </Col>
      </Row>
    </Container>
  );
}
