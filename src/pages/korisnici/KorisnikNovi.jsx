import { Button, Col, Form, Row } from "react-bootstrap";
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

        dodaj({
            ime: podaci.get("ime"),
            prezime: podaci.get("prezime"),
            email: podaci.get("email"),
            datumKreiranja: new Date().toISOString()
        });
    }

    return (
        <>
            <h3>Unos novog korisnika</h3>

            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" required />
                </Form.Group>

                <hr style={{ marginTop: "30px", border: "0" }} />

                <Row>
                    <Col>
                        <Link to={RouteNames.KORISNICI} className="btn btn-danger">
                            Odustani
                        </Link>
                    </Col>
                    <Col>
                        <Button type="submit" variant="success">
                            Dodaj novog korisnika
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}