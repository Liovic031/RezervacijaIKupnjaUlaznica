import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import DogadjajService from "../../services/dogadjaji/DogadjajService";
import { useEffect, useState } from "react";

export default function DogadjajPromjena() {
    const navigate = useNavigate();
    const params = useParams();
    const [dogadjaj, setDogadjaj] = useState({})
    const [aktivan, setAktivan] = useState(false)

    async function ucitajDogadjaj() {
        await DogadjajService.getBySifra(params.sifra).then((odgovor) => {

            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }

            const d = odgovor.data
            d.datumOdrzavanja = d.datumOdrzavanja.substring(0, 10)

            setDogadjaj(d)
            setAktivan(d.aktivan)
        })
    }


    useEffect(() => {
        ucitajDogadjaj()
    }, [])

    async function promjeni(dogadjaj) {
        await DogadjajService.promjeni(params.sifra, dogadjaj).then(() => {
            navigate(RouteNames.DOGADJAJI)
        })
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        // --- Kontrole ---
        if (!podaci.get("naziv")?.trim()) {
            alert("Naziv je obavezan!");
            return;
        }
        if (podaci.get("naziv").trim().length < 3) {
            alert("Naziv mora imati najmanje 3 znaka!");
            return;
        }

        if (!podaci.get("datumOdrzavanja")) {
            alert("Datum održavanja je obavezan!");
            return;
        }

        const danas = new Date();
        danas.setHours(0, 0, 0, 0);

        const datum = new Date(podaci.get("datumOdrzavanja"));
        if (datum < danas) {
            alert("Datum održavanja ne može biti u prošlosti!");
            return;
        }

        if (!podaci.get("brojMjesta") || parseInt(podaci.get("brojMjesta")) <= 0) {
            alert("Broj mjesta mora biti veći od 0!");
            return;
        }

        if (!podaci.get("cijena") || parseFloat(podaci.get("cijena")) < 0) {
            alert("Cijena mora biti 0 ili više!");
            return;
        }

        promjeni({
            naziv: podaci.get('naziv'),
            lokacija: podaci.get('lokacija'),
            datumOdrzavanja: new Date(podaci.get('datumOdrzavanja')).toISOString(),
            brojMjesta: parseInt(podaci.get('brojMjesta')),
            cijena: parseFloat(podaci.get('cijena')),
            aktivan: podaci.get('aktivan') === 'on'
        })
    }



    return (
        <>
            <h3 className="mb-4">Promjena događaja</h3>

            <Form onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="naziv">
                                        <Form.Label>Naziv</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="naziv"
                                            required
                                            defaultValue={dogadjaj.naziv}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="lokacija">
                                        <Form.Label>Lokacija</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lokacija"
                                            defaultValue={dogadjaj.lokacija}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="datumOdrzavanja">
                                        <Form.Label>Datum održavanja</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="datumOdrzavanja"
                                            defaultValue={dogadjaj.datumOdrzavanja}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="brojMjesta">
                                        <Form.Label>Broj mjesta</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="brojMjesta"
                                            step={1}
                                            defaultValue={dogadjaj.brojMjesta}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="cijena">
                                        <Form.Label>Cijena</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="cijena"
                                            step={0.01}
                                            defaultValue={dogadjaj.cijena}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group
                                        controlId="aktivan"
                                        className="mb-3 mt-md-3"
                                    >
                                        <Form.Check
                                            type="switch"
                                            label="Događaj je aktivan"
                                            name="aktivan"
                                            className="fs-5"
                                            checked={aktivan}
                                            onChange={(e) => setAktivan(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.DOGADJAJI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>

                                <Button type="submit" variant="success" className="px-4">
                                    Promijeni
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    )
}