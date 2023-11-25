import React, { useCallback, useContext, useRef } from 'react';
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import { Form as Unform } from '@unform/web';
import * as Yup from 'yup';
import { redirect } from 'react-router-dom';

import { UserContext } from '~/contexts/User';
import api from '~/services/api';
import { Input } from '~/components/Input';
import { Title } from '~/components/Title';
import { getValidationErrors } from '~/utils/getValidationErrors';
import { Box } from './styles';

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
            <Title>
              <span>L</span>ogin
            </Title>
            <Unform ref={formRef} onSubmit={handleLogin}>
              <Form.Group>
                <Input
                  data-testid="email"
                  type="email"
                  className="form-control form-control-lg rounded"
                  placeholder="Email"
                  name="email"
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Input
                  data-testid="password"
                  type="password"
                  placeholder="Senha"
                  className="form-control form-control-lg rounded"
                  name="password"
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button
                  data-testid="submit"
                  type="submit"
                  size="lg"
                  className="container-fluid rounded mt-3"
                  onClick={() => formRef.current?.submitForm()}
                >
                  Entrar
                </Button>
              </div>
            </Unform>
          </Box>
        </Col>
      </Row>
    </Container>
  );
}
