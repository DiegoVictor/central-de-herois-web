import React from 'react';
import { Form, Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Form as Unform } from '@unform/web';
import PropTypes from 'prop-types';

import { Input } from '~/components/Input';
import { Modal } from '~/components/Modal';
import { Select } from '~/components/Select';

export function FormModal({ formData, handleMonsterDefeated, onHide }) {
  return (
    <Modal title="Ameaça" show={formData} onHide={onHide}>
      <Unform
        initialData={formData}
        onSubmit={(data) => {
          const { _id } = formData;
          handleMonsterDefeated({
            ...data,
            monsterId: _id,
          });
        }}
      >
        <Form.Group>
          <Form.Label>Status do(s) heroi(s) após o combate:</Form.Label>
        </Form.Group>

        <Row>
          {formData?.heroes?.map((hero, index) => (
            <Col xs={6} key={hero._id}>
              <Form.Group>
                <Form.Label>{hero.name}</Form.Label>

                <Input
                  type="hidden"
                  name={`heroes[${index}][_id]`}
                  defaultValue={hero._id}
                />

                <Select
                  className="form-control"
                  key={hero._id}
                  name={`heroes[${index}][status]`}
                  data-testid={`hero_status_${hero._id}`}
                >
                  <option value="resting">Descansando</option>
                  <option value="patrolling">Patrulhando</option>
                  <option value="out_of_combat">Fora de combate</option>
                </Select>
              </Form.Group>
            </Col>
          ))}
        </Row>

        <ButtonGroup>
          <Button data-testid="cancel" variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button data-testid="submit" type="submit">
            Enviar
          </Button>
        </ButtonGroup>
      </Unform>
    </Modal>
  );
}

FormModal.propTypes = {
  formData: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    heroes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  handleMonsterDefeated: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

FormModal.defaultProps = {
  formData: null,
};
