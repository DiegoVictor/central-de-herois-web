import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import {
  Form as Frm,
  Table,
  Row,
  Col,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';

import { getLabel } from '~/helpers/HeroStatuses';
import api from '~/services/api';
import { Select } from '~/components/Select';
import { Input } from '~/components/Input';
import { Modal } from '~/components/Modal';
import { Container } from './styles';

export function Heroes() {
  const [heroes, setHeroes] = useState([]);
  const [formData, setFormData] = useState(null);
  const googleMapUrl = useMemo(() => '//www.google.com.br/maps/place/', []);

  const handleRemoveHero = useCallback(
    async (id) => {
      try {
        await api.delete(`/heroes/${id}`);

        setHeroes(heroes.filter((hero) => hero._id !== id));
      } catch (err) {
        alert('Não foi possivel remover o heroi, tente novamente!');
      }
    },
    [heroes]
  );

  const handleHeroForm = useCallback(
    ({ name, rank, status, latitude, longitude }, notify) => {
      (async () => {
        if (hero._id) {
          try {
            const response = await api.put(`/heroes/${hero._id}`, {
              name,
              rank,
              status,
              latitude,
              longitude,
            });

            setHeroes(
              heroes.map((h) => {
                if (h._id === hero._id) {
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
      const { data } = await api.get('heroes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHeroes(
        data.map((hero) => ({
          ...hero,
          latitude: hero.location.coordinates[1],
          longitude: hero.location.coordinates[0],
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
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {heroes.map((hero) => (
                      <tr key={hero._id} data-testid={`hero_${hero._id}`}>
                        <td>{hero.name}</td>
                        <td data-testid={`hero_rank_${hero._id}`}>
                          {hero.rank}
                        </td>
                        <td>
                          <Link
                            to={`${
                              googleMapUrl + hero.location.coordinates[1]
                            },${hero.location.coordinates[0]}`}
                            target="_blank"
                          >
                            {hero.location.coordinates
                              .slice()
                              .reverse()
                              .join(', ')}
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

          <Modal
            title="Heroi"
            show={!!formData}
            onHide={() => setFormData(null)}
          >
                  <Form
              initialData={formData}
                    onSubmit={(data) => {
                handleHeroForm(data);
                    }}
                  >
                    <Frm.Group>
                      <Frm.Label>Nome</Frm.Label>
                      <Input
                        className="form-control"
                        name="name"
                        data-testid="name"
                      />
                    </Frm.Group>
                    <Frm.Group>
                      <Frm.Label>Rank</Frm.Label>
                      <Select
                        className="form-control"
                        name="rank"
                        data-testid="rank"
                      >
                        {['S', 'A', 'B', 'C'].map((rank) => (
                          <option key={rank} value={rank}>
                            {rank}
                          </option>
                        ))}
                      </Select>
                    </Frm.Group>
                    <Row>
                      <Col>
                        <Frm.Group>
                          <Frm.Label>Latitude</Frm.Label>
                          <Input
                            className="form-control"
                            name="latitude"
                            data-testid="latitude"
                          />
                        </Frm.Group>
                      </Col>
                      <Col>
                        <Frm.Group>
                          <Frm.Label>Longitude</Frm.Label>
                          <Input
                            className="form-control"
                            name="longitude"
                            data-testid="longitude"
                          />
                        </Frm.Group>
                      </Col>
                    </Row>
              {formData && formData.status !== 'fighting' && (
                      <Frm.Group>
                        <Frm.Label>Status</Frm.Label>
                        <Select
                          className="form-control"
                          name="status"
                          data-testid="status"
                        >
                          <option value="resting">Descasando</option>
                          <option value="out_of_combat">Fora de Combate</option>
                          <option value="patrolling">Patrulhando</option>
                        </Select>
                      </Frm.Group>
                    )}
                    <ButtonGroup>
                      <Button
                        data-testid="cancel"
                        variant="secondary"
                  onClick={() => setFormData(null)}
                      >
                        Cancelar
                      </Button>
                      <Button data-testid="submit" type="submit">
                        Enviar
                      </Button>
                    </ButtonGroup>
                  </Form>
                </Modal>
        </Col>
      </Row>
    </Container>
  );
}
