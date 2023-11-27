import React from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { Form as Unform } from '@unform/web';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

import { Input } from '~/components/Input';
import { Select } from '~/components/Select';

export function FormModal({ formData, handleMonsterDefeated, onHide }) {
  return (
    <Modal title="Ameaça" show={formData} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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

          <ListGroup className="mt-3">
            {formData?.heroes?.map((hero, index) => (
              <ListGroup.Item
                xs={6}
                key={hero._id}
                variant="dark"
                className="d-flex align-items-center justify-content-between"
              >
                {hero.name}

                <Input
                  type="hidden"
                  name={`heroes[${index}][_id]`}
                  defaultValue={hero._id}
                />

                <Select
                  className="form-control w-auto"
                  key={hero._id}
                  name={`heroes[${index}][status]`}
                  data-testid={`hero_status_${hero._id}`}
                >
                  <option value="resting">Descansando</option>
                  <option value="patrolling">Patrulhando</option>
                  <option value="out_of_combat">Fora de combate</option>
                </Select>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Unform>
      </Modal.Body>

      <Modal.Footer>
        <Button
          data-testid="cancel"
          variant="secondary"
          onClick={onHide}
          className="rounded"
        >
          Cancelar
        </Button>
        <Button
          data-testid="submit"
          variant="success"
          type="submit"
          className="rounded"
        >
          Alterar
        </Button>
      </Modal.Footer>
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
