import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";

export default function KorisnikNovi() {

    const navigate = useNavigate();

    async function dodaj(korisnik) {
        await KorisnikService.dodaj(korisnik).then(() => {
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

        dodaj({
            ime: podaci.get("ime"),
            prezime: podaci.get("prezime"),
            email: podaci.get("email"),
            datumKreiranja: new Date().toISOString()
        });
    }

    return (
        <>
            <h3 className="mb-4">Unos novog korisnika</h3>

            <Form onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="ime">
                                        <Form.Label>Ime</Form.Label>
                                        <Form.Control type="text" name="ime" required />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="prezime">
                                        <Form.Label>Prezime</Form.Label>
                                        <Form.Control type="text" name="prezime" required />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.KORISNICI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success" className="px-4">
                                    Dodaj korisnika
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    );
}