import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import api from '~/services/api';
import { Container } from './styles';
import { FormModal } from './FormModal';
import { HeroesTable } from './HeroesTable';

const createOrUpdate = async (id, data) => {
  if (id) {
    return api.put(`/heroes/${id}`, data);
  }

  return api.post('heroes', data);
};

export function Heroes() {
  const [heroes, setHeroes] = useState([]);
  const [formData, setFormData] = useState(null);

  const reList = useCallback(async () => {
    try {
      const { data } = await api.get('heroes');

      setHeroes(data);
    } catch {
      alert('Não foi possivel atualizar a lista de herois');
    }
  }, []);

  const handleRemoveHero = useCallback(
    async (id) => {
      try {
        await api.delete(`/heroes/${id}`);

        await reList();
      } catch (err) {
        alert('Não foi possivel remover o heroi, tente novamente!');
      }
    },
    [reList]
  );

  const handleHeroForm = useCallback(
    ({ _id, name, rank, status, latitude, longitude }) => {
      (async () => {
        try {
          await createOrUpdate(_id, {
            name,
            rank,
            status,
            latitude,
            longitude,
          });

          await reList();
          setFormData(null);
        } catch (err) {
          alert('Não foi possivel criar/atualizar o heroi, tente novamente!');
        }
      })();
    },
    [reList]
  );

  useEffect(() => {
    reList();
  }, [reList]);

  return (
    <Container className="container">
      <Title className="d-flex justify-content-between align-items-center">
        <div>
          <span>H</span>erois ({heroes.length})
        </div>
        <div>
          <Button
            data-testid="new"
            onClick={() => setFormData({})}
            size="sm"
            variant="success"
          >
            Adicionar
          </Button>
        </div>
      </Title>
          <HeroesTable
            heroes={heroes}
            handleRemoveHero={handleRemoveHero}
            setFormData={setFormData}
          />

          <FormModal
            formData={formData}
            onHide={() => setFormData(null)}
            handleHeroForm={handleHeroForm}
          />
        </Col>
      </Row>
    </Container>
  );
}
