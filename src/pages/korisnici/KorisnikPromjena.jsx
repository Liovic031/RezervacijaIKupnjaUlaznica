import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { useEffect, useState } from "react";

export default function KorisnikPromjena() {

    const navigate = useNavigate();
    const params = useParams();

    const [korisnik, setKorisnik] = useState({});

    async function ucitajKorisnik() {
        await KorisnikService.getBySifra(params.sifra).then((odgovor) => {

            if (!odgovor.success) {
                alert("Nije implementiran servis");
                return;
            }

            setKorisnik(odgovor.data);
        });
    }

    useEffect(() => {
        ucitajKorisnik();
    }, []);

    async function promjeni(korisnik) {
        await KorisnikService.promjeni(params.sifra, korisnik).then(() => {
            navigate(RouteNames.KORISNICI);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        // --- Kontrole ---
        if (!podaci.get("ime")?.trim()) {
            alert("Ime je obavezno!");
            return;
        }
        if (podaci.get("ime").trim().length < 2) {
            alert("Ime mora imati najmanje 2 znaka!");
            return;
        }
        if (!podaci.get("prezime")?.trim()) {
            alert("Prezime je obavezno!");
            return;
        }
        if (podaci.get("prezime").trim().length < 2) {
            alert("Prezime mora imati najmanje 2 znaka!");
            return;
        }
        if (!podaci.get("email")?.trim()) {
            alert("Email je obavezan!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(podaci.get("email"))) {
            alert("Email nije u ispravnom formatu!");
            return;
        }

        promjeni({
            ime: podaci.get("ime"),
            prezime: podaci.get("prezime"),
            email: podaci.get("email"),
        });
    }

    return (
       <>
            <h3 className="mb-4">Promjena korisnika</h3>

            <Form onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="ime">
                                        <Form.Label>Ime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ime"
                                            required
                                            defaultValue={korisnik.ime}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="prezime">
                                        <Form.Label>Prezime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="prezime"
                                            required
                                            defaultValue={korisnik.prezime}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            defaultValue={korisnik.email}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.KORISNICI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>

                                <Button type="submit" variant="success" className="px-4">
                                    Spremi promjene
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    );
}