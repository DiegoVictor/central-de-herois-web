import React from 'react';
import { Table, OverlayTrigger, Popover, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { googleMapUrl } from '~/utils/constants';

export function FightingTable({ monsters, setFormData }) {
  return (
    <Table hover striped size="sm" className="mt-0">
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
          <tr key={monster._id}>
            <td>
              {monster.heroes.map((hero) => (
                <OverlayTrigger
                  key={hero._id}
                  trigger={['hover', 'focus']}
                  placement="bottom"
                  overlay={
                    <Popover>
                      <Popover.Header as="h3">{hero.name}</Popover.Header>
                      <Popover.Body>
                        <p>{hero.description}</p>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <span>
                    {hero.name}
                    <Badge
                      data-testid={`hero_rank_${hero._id}`}
                      variant="secondary"
                    >
                      {hero.rank}
                    </Badge>
                  </span>
                </OverlayTrigger>
              ))}
            </td>
            <td>
              <span className="d-flex align-items-center">
                {monster.name}{' '}
                <Badge
                  className="ml-1"
                  variant="secondary"
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
                {monster.latitude},{monster.longitude}
              </Link>
            </td>
            <td className="text-right">
              <Button
                data-testid={`monster_defeated_${monster._id}_button`}
                onClick={() => {
                  setFormData(monster);
                }}
                size="sm"
              >
                Ameaça combatida
              </Button>
            </td>
          </tr>
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
