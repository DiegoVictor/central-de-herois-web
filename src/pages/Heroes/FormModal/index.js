import React from 'react';
import { Form as Unform } from '@unform/web';
import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { Input } from '~/components/Input';
import { Select } from '~/components/Select';
import { Modal } from '~/components/Modal';

export function FormModal({ formData = null, handleHeroForm, onHide }) {
  return (
    <Modal title="Heroi" show={formData} onHide={onHide}>
      <Unform initialData={formData} onSubmit={handleHeroForm}>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Input className="form-control" name="name" data-testid="name" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Rank</Form.Label>
          <Select className="form-control" name="rank" data-testid="rank">
            {['S', 'A', 'B', 'C'].map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </Select>
        </Form.Group>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Latitude</Form.Label>
              <Input
                className="form-control"
                name="latitude"
                data-testid="latitude"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Longitude</Form.Label>
              <Input
                className="form-control"
                name="longitude"
                data-testid="longitude"
              />
            </Form.Group>
          </Col>
        </Row>

        {formData?.status !== 'fighting' && (
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Select className="form-control" name="status" data-testid="status">
              <option value="resting">Descasando</option>
              <option value="out_of_combat">Fora de Combate</option>
              <option value="patrolling">Patrulhando</option>
            </Select>
          </Form.Group>
        )}
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
  formData: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      rank: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
    PropTypes.object, // null
  ]),
  handleHeroForm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

FormModal.defaultProps = {
  formData: null,
};
