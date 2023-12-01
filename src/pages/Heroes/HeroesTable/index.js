import React from 'react';
import { Table, Button, Badge, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getLabel } from '~/helpers/HeroStatuses';
import { googleMapUrl } from '~/utils/constants';

export function HeroesTable({ heroes, handleRemoveHero, setFormData }) {
  return (
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
                to={`${googleMapUrl}${hero.latitude},${hero.longitude}`}
                target="_blank"
              >
                {hero.latitude}, {hero.longitude}
              </Link>
            </td>
            <td data-testid={`hero_status_${hero._id}`}>
              <Badge pill>{getLabel(hero.status)}</Badge>
            </td>
            <td className="text-right">
              <div className="d-flex justify-content-end me-3">
                <ButtonGroup>
                  <Button
                    data-testid={`hero_edit_${hero._id}`}
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setFormData(hero);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
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
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

HeroesTable.propTypes = {
  heroes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      rank: PropTypes.string.isRequired,
      latitude: PropTypes.string.isRequired,
      longitude: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleRemoveHero: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};
