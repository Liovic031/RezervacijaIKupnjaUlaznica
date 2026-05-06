import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { RouteNames } from "../constants";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    async function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);
        const email = podaci.get("email");
        const lozinka = podaci.get("lozinka");

        setErrors({});
        const res = await login(email, lozinka);
        if (!res.success) {
            setErrors({ opce: res.message });
            return;
        }

        // uspješan login -> redirect (AuthProvider već radi navigate, ali osiguraj fallback)
        navigate(RouteNames.NADZORNA_PLOCA);
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-4">Podaci za prijavu</Card.Title>
                    <p className="text-muted">Za test: admin@edunova.hr / Edunova123!</p>
                    <p className="text-muted">svi generirani korisnici imaju istu lozinku: Test123!</p>

                    {errors.opce && <div className="alert alert-danger">{errors.opce}</div>}

                    <Form onSubmit={odradiSubmit}>
                        <Row>
                            <Col xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lozinka</Form.Label>
                                    <Form.Control type="password" name="lozinka" required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <Button type="submit" variant="success">Prijavi se</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
