import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { RouteNames } from "../constants";

export default function Registracija() {
  const { registracija } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  async function odradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    const ime = podaci.get("ime");
    const prezime = podaci.get("prezime");
    const email = podaci.get("email");
    const lozinka = podaci.get("lozinka");
    const potvrda = podaci.get("potvrdaLozinke");

    setErrors({});
    if (lozinka !== potvrda) {
      setErrors({ potvrdaLozinke: "Lozinke se ne podudaraju!" });
      return;
    }

    const res = await registracija({ ime, prezime, email, lozinka });
    if (!res.success) {
      setErrors({ opce: res.message });
      return;
    }

    navigate(RouteNames.LOGIN);
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Podaci za registraciju</Card.Title>

          {errors.opce && <div className="alert alert-danger">{errors.opce}</div>}

          <Form onSubmit={odradiSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ime</Form.Label>
                  <Form.Control name="ime" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prezime</Form.Label>
                  <Form.Control name="prezime" required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lozinka</Form.Label>
                  <Form.Control type="password" name="lozinka" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Potvrdi lozinku</Form.Label>
                  <Form.Control type="password" name="potvrdaLozinke" required />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Button type="submit" variant="success">Registriraj se</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
