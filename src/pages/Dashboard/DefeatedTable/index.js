import React from 'react';
import { Table, Badge, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { googleMapUrl } from '~/utils/constants';

const toLocaleString = (date) => new Date(date).toLocaleString();

export function DefeatedTable({ monsters }) {
  return (
    <Table hover striped size="sm" className="mt-0">
      <thead>
        <tr>
          <th>Heroi(s)</th>
          <th>Ameaça</th>
          <th>Localização</th>
          <th>Última atualização</th>
        </tr>
      </thead>
      <tbody>
        {monsters.length === 0 && (
          <tr>
            <td colSpan="4" className="text-center">
              Sem resultados
            </td>
          </tr>
        )}
        {monsters.map((monster) => (
          <tr key={monster._id}>
            <td data-testid={`monster_defeated_${monster._id}`}>
              <ListGroup>
                {monster.heroes.map((hero) => (
                  <ListGroup.Item
                    className="d-flex justify-content-between align-items-start"
                    key={hero._id}
                  >
                    {hero.name}
                    <Badge bg="secondary">
                      <div data-testid={`hero_rank_${hero._id}`}>
                        {hero.rank}
                      </div>
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
            <td>{toLocaleString(monster.updatedAt)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

DefeatedTable.propTypes = {
  monsters: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      rank: PropTypes.string.isRequired,
      latitude: PropTypes.string.isRequired,
      longitude: PropTypes.string.isRequired,
      updatedAt: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string,
      ]),
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
};
