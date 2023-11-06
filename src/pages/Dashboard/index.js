import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from 'react-bootstrap';

import api from '~/services/api';
import { FightingTable } from './FightingTable';
import { DefeatedTable } from './DefeatedTable';
import { FormModal } from './FormModal';
import { Container } from './styles';

const ONE_MINUTE = 60 * 1000;

export function Dashboard() {
  const [monsters, setMonsters] = useState([]);
  const [defeated, setDefeated] = useState([]);

  const [formData, setFormData] = useState(null);

  const reList = useCallback(async (key) => {
    switch (key) {
      case 'fighting': {
  const { data } = await api.get('monsters', {
    params: {
      status: 'fighting',
    },
  });

        setMonsters(data);
        break;
}

      case 'defeated': {
  const { data } = await api.get('monsters', {
    params: {
      status: 'defeated',
    },
  });

        setDefeated(data);
        break;
      }

      default: {
        await Promise.all([reList('fighting'), reList('defeated')]);
      }
    }
  }, []);

  const handleMonsterDefeated = useCallback(
    async ({ monsterId, heroes }) => {
        try {
        await api.put(`/monsters/${monsterId}/defeated`, { heroes });

        reList();
        } catch (err) {
        alert('Não foi possivel atualizar o status da ameaça!');
        }

      setFormData(null);
    },
    [reList]
  );

  useEffect(() => {
    (async () => {
      await reList();
      setInterval(() => reList('fighting'), ONE_MINUTE);
    })();
  });

  return (
    <Container>
      <h5 className="d-flex align-items-center">
        Combatendo{' '}
        <Badge className="ml-1" variant="primary">
          {monsters.length}
        </Badge>
      </h5>
      <FightingTable monsters={monsters} setFormData={setFormData} />

      <h5 className="d-flex mt-5 align-items-center">
        Combatidos
        <Badge className="ml-1" variant="primary">
          {history.length}
        </Badge>
      </h5>
      <DefeatedTable monsters={defeated} />

      <FormModal
        formData={formData}
        handleMonsterDefeated={handleMonsterDefeated}
        onHide={() => setFormData(null)}
      />
    </Container>
  );
}
