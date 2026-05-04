import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { useState } from "react";
import { ShemaKorisnik } from "../../schemas/ShemaKorisnik";

export default function KorisnikNovi() {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    async function dodaj(korisnik) {
        await KorisnikService.dodaj(korisnik).then(() => {
            navigate(RouteNames.KORISNICI);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        setErrors({});

        const podaci = new FormData(e.target);
        const objekt = Object.fromEntries(podaci);

        // ZOD VALIDACIJA
        const rezultat = ShemaKorisnik.safeParse(objekt);

        if (!rezultat.success) {
            const greske = {};

            rezultat.error.issues.forEach(issue => {
                const kljuc = issue.path[0];
                if (!greske[kljuc]) {
                    greske[kljuc] = issue.message;
                }
            });

            setErrors(greske);
            return;
        }

        // Ako je sve OK
        dodaj({
            ...rezultat.data,
            datumKreiranja: new Date().toISOString()
        });
    }

    const ocistiGresku = (polje) => {
        if (errors[polje]) {
            const nove = { ...errors };
            delete nove[polje];
            setErrors(nove);
        }
    };

    return (
        <>
            <h3 className="mb-4">Unos novog korisnika</h3>

            <Form noValidate onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    {/* Ime */}
                                    <Form.Group className="mb-3" controlId="ime">
                                        <Form.Label>Ime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ime"
                                            isInvalid={!!errors.ime}
                                            onFocus={() => ocistiGresku("ime")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.ime}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Prezime */}
                                    <Form.Group className="mb-3" controlId="prezime">
                                        <Form.Label>Prezime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="prezime"
                                            isInvalid={!!errors.prezime}
                                            onFocus={() => ocistiGresku("prezime")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.prezime}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    {/* Email */}
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            isInvalid={!!errors.email}
                                            onFocus={() => ocistiGresku("email")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Button type="submit" variant="success" className="px-4">
                                    Dodaj
                                </Button>
                                <Link to={RouteNames.KORISNICI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    );
}
