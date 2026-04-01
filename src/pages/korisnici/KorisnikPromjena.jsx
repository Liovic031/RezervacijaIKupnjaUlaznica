import { Button, Col, Form, Row } from "react-bootstrap";
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

        promjeni({
            ime: podaci.get("ime"),
            prezime: podaci.get("prezime"),
            email: podaci.get("email"),
            lozinka: podaci.get("lozinka")
        });
    }

    return (
        <>
            <h3>Promjena korisnika</h3>

            <Form onSubmit={odradiSubmit}>
                <Form.Group controlId="ime">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control type="text" name="ime" required defaultValue={korisnik.ime} />
                </Form.Group>

                <Form.Group controlId="prezime">
                    <Form.Label>Prezime</Form.Label>
                    <Form.Control type="text" name="prezime" required defaultValue={korisnik.prezime} />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" defaultValue={korisnik.email} />
                </Form.Group>

                <Form.Group controlId="lozinka">
                    <Form.Label>Lozinka</Form.Label>
                    <Form.Control type="password" name="lozinka" defaultValue={korisnik.lozinka} />
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
                            Promijeni
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}