import React from 'react';
import { Table, Badge, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { googleMapUrl } from '~/utils/constants';
import { Tr } from '../styles';

export function FightingTable({ monsters, setFormData }) {
  return (
    <Table hover striped borderless size="sm" variant="dark">
      <thead>
        <tr>
          <th>Heroi(s)</th>
          <th>Ameaça</th>
          <th>Localização</th>
          <th aria-label="Ações" />
        </tr>
      </thead>
      <tbody>
        {monsters.map((monster) => (
          <Tr key={monster._id}>
            <td>
              <ListGroup>
                {monster.heroes.map((hero) => (
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-start"
                    variant="dark"
                    key={hero._id}
                  >
                    {hero.name}
                    <Badge bg="secondary" data-testid={`hero_rank_${hero._id}`}>
                      {hero.rank}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </td>
            <td>
              <span className="d-flex align-items-center">
                {monster.name}
                <Badge
                  className="ms-1"
                  bg="secondary"
                  data-testid={`monster_rank_${monster._id}`}
                >
                  {monster.rank}
                </Badge>
              </span>
            </td>
            <td>
              <Link
                to={`${googleMapUrl}${monster.latitude},${monster.longitude}`}
                target="_blank"
              >
                {monster.latitude}, {monster.longitude}
              </Link>
            </td>
            <td>
              <div className="d-flex justify-content-end me-3">
                <Button
                  data-testid={`monster_defeated_${monster._id}_button`}
                  onClick={() => {
                    setFormData(monster);
                  }}
                  size="sm"
                  variant="success"
                >
                  Ameaça combatida
                </Button>
              </div>
            </td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

FightingTable.propTypes = {
  monsters: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      rank: PropTypes.string.isRequired,
      latitude: PropTypes.string.isRequired,
      longitude: PropTypes.string.isRequired,
      heroes: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          rank: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  setFormData: PropTypes.func.isRequired,
};
