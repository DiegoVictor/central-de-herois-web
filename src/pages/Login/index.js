import React, { useCallback, useContext, useRef } from 'react';
import { Container, Col, Row, Button, Form as Frm } from 'react-bootstrap';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import UserContext from '~/contexts/User';
import api from '~/services/api';
import Input from '~/components/Input';
import Box from '~/components/Box';
import { getValidationErrors } from '~/utils/getValidationErrors';
import { redirect } from 'react-router-dom';

export default () => {
  const formRef = useRef(null);
  const context = useContext(UserContext);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Email inválido')
            .required('O email é obrigatório'),
          password: Yup.string().required('A senha é obrigatória'),
        });

        await schema.validate(
          { email, password },
          {
            abortEarly: false,
          }
        );

        const { data } = await api.post('sessions', { email, password });

        localStorage.setItem('iheroes_user', JSON.stringify(data));
        context.token = data.token;
        context.user = data.user;

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
    [context.token, context.user]
  );

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center h-100">
        <Col className="d-flex align-items-center">
          <Box>
            <Form ref={formRef} onSubmit={handleLogin}>
              <Frm.Group>
                <Frm.Label>Email</Frm.Label>
                <Input
                  data-testid="email"
                  type="email"
                  className="form-control form-control-lg"
                  name="email"
                />
              </Frm.Group>
              <Frm.Group>
                <Frm.Label>Senha</Frm.Label>
                <Input
                  data-testid="password"
                  type="password"
                  className="form-control form-control-lg"
                  name="password"
                />
              </Frm.Group>

              <Button
                data-testid="submit"
                type="submit"
                size="lg"
                onClick={() => formRef.current?.submitForm()}
              >
                Entrar
              </Button>
            </Form>
          </Box>
        </Col>
      </Row>
    </Container>
  );
};
