import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import KorisnikService from "../../services/korisnici/KorisnikService";
import DogadjajService from "../../services/dogadjaji/DogadjajService";

export default function RezervacijaNova() {

    const navigate = useNavigate();

    const [korisnici, setKorisnici] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);

    async function ucitajKorisnike() {
        const odgovor = await KorisnikService.get();
        if (odgovor.success) setKorisnici(odgovor.data);
    }

    async function ucitajDogadjaje() {
        const odgovor = await DogadjajService.get();
        if (odgovor.success) setDogadjaji(odgovor.data);
    }

    useEffect(() => {
        ucitajKorisnike();
        ucitajDogadjaje();
    }, []);

    async function dodaj(rezervacija) {
        await RezervacijaService.dodaj(rezervacija);
        navigate(RouteNames.REZERVACIJE);
    }

    function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        if (!podaci.get("korisnik")) {
            alert("Odaberite korisnika!");
            return;
        }

        if (!podaci.get("dogadjaj")) {
            alert("Odaberite događaj!");
            return;
        }

        dodaj({
            korisnikSifra: parseInt(podaci.get("korisnik")),
            dogadjajSifra: parseInt(podaci.get("dogadjaj")),
            datumRezervacije: new Date().toISOString()
        });
        
    }

    return (
        <>
            <h3 className="mb-4">Nova rezervacija</h3>

            <Form onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">

                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Korisnik</Form.Label>
                                        <Form.Select name="korisnik" required>
                                            <option value="">-- odaberite korisnika --</option>
                                            {korisnici.map(k => (
                                                <option key={k.sifra} value={k.sifra}>
                                                    {k.ime} {k.prezime}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Događaj</Form.Label>
                                        <Form.Select name="dogadjaj" required>
                                            <option value="">-- odaberite događaj --</option>
                                            {dogadjaji.map(d => (
                                                <option key={d.sifra} value={d.sifra}>
                                                    {d.naziv}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.REZERVACIJE} className="btn btn-danger px-4">
                                    Odustani
                                </Link>

                                <Button type="submit" variant="success" className="px-4">
                                    Kreiraj rezervaciju
                                </Button>
                            </div>
                        </Card.Body>

                    </Card>
                </Container>
            </Form>
        </>
    );
}