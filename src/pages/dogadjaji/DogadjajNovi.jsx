import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import DogadjajService from "../../services/dogadjaji/DogadjajService";
import { useState } from "react";
import { ShemaDogadjaj } from "../../schemas/ShemaDogadjaj";

export default function DogadjajNovi() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    async function dodaj(dogadjaj) {
        await DogadjajService.dodaj(dogadjaj).then(() => {
            navigate(RouteNames.DOGADJAJI);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        setErrors({});

        const podaci = new FormData(e.target);
        const objekt = Object.fromEntries(podaci);

        // checkbox pretvorimo u boolean
        objekt.aktivan = podaci.get("aktivan") === "on";

        // ZOD VALIDACIJA
        const rezultat = ShemaDogadjaj.safeParse(objekt);

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

        // Ako je sve OK → šaljemo podatke
        dodaj({
            ...rezultat.data,
            datumOdrzavanja: rezultat.data.datumOdrzavanja.toISOString()
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
            <h3 className="mb-4">Unos novog događaja</h3>

            <Form onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    {/* Naziv */}
                                    <Form.Group className="mb-3" controlId="naziv">
                                        <Form.Label>Naziv</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            isInvalid={!!errors.naziv}
                                            onFocus={() => ocistiGresku("naziv")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.naziv}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Lokacija */}
                                    <Form.Group className="mb-3" controlId="lokacija">
                                        <Form.Label>Lokacija</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lokacija"
                                            isInvalid={!!errors.lokacija}
                                            onFocus={() => ocistiGresku("lokacija")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lokacija}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Datum */}
                                    <Form.Group className="mb-3" controlId="datumOdrzavanja">
                                        <Form.Label>Datum održavanja</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="datumOdrzavanja"
                                            isInvalid={!!errors.datumOdrzavanja}
                                            onFocus={() => ocistiGresku("datumOdrzavanja")}
                                            onClick={(e) => e.target.showPicker()}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.datumOdrzavanja}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    {/* Broj mjesta */}
                                    <Form.Group className="mb-3" controlId="brojMjesta">
                                        <Form.Label>Broj mjesta</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="brojMjesta"
                                            isInvalid={!!errors.brojMjesta}
                                            onFocus={() => ocistiGresku("brojMjesta")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.brojMjesta}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Cijena */}
                                    <Form.Group className="mb-3" controlId="cijena">
                                        <Form.Label>Cijena</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step={0.01}
                                            name="cijena"
                                            isInvalid={!!errors.cijena}
                                            onFocus={() => ocistiGresku("cijena")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cijena}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Aktivnost */}
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="aktivan" className="mb-3 mt-md-3">
                                        <Form.Check
                                            type="switch"
                                            label="Događaj je aktivan"
                                            name="aktivan"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Button type="submit" variant="success" className="px-4">
                                    Dodaj
                                </Button>

                                <Link to={RouteNames.DOGADJAJI} className="btn btn-danger px-4">
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
