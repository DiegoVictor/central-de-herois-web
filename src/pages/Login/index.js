import React, { useCallback, useContext, useRef } from 'react';
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import { Form as Unform } from '@unform/web';
import * as Yup from 'yup';
import { redirect } from 'react-router-dom';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { Input } from '~/components/Input';
import { Box } from '~/components/Box';
import { getValidationErrors } from '~/utils/getValidationErrors';

const schema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('O email é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export function Login() {
  const formRef = useRef(null);
  const { setUser } = useContext(UserContext);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        formRef.current.setErrors({});

        await schema.validate(
          { email, password },
          {
            abortEarly: false,
          }
        );

        const { data } = await api.post('sessions', { email, password });
        setUser({
          ...data.user,
          token: data.token,
        });

        redirect('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current.setErrors(errors);
        } else {
          alert('Oops! Alguma coisa deu errado, tente novamente!');
        }
      }
    },
    [setUser]
  );

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center h-100">
        <Col className="d-flex align-items-center">
          <Box>
            <Unform ref={formRef} onSubmit={handleLogin}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Input
                  data-testid="email"
                  type="email"
                  className="form-control form-control-lg"
                  name="email"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Senha</Form.Label>
                <Input
                  data-testid="password"
                  type="password"
                  className="form-control form-control-lg"
                  name="password"
                />
              </Form.Group>

              <Button
                data-testid="submit"
                type="submit"
                size="lg"
                onClick={() => formRef.current?.submitForm()}
              >
                Entrar
              </Button>
            </Unform>
          </Box>
        </Col>
      </Row>
    </Container>
  );
}
