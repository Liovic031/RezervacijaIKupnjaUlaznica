import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import KorisnikService from "../../services/korisnici/KorisnikService";
import DogadjajService from "../../services/dogadjaji/DogadjajService";
import KartaService from "../../services/karte/KartaService";

export default function RezervacijaNova() {

    const navigate = useNavigate();

    const [korisnici, setKorisnici] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);
    const [karte, setKarte] = useState([]);
    const [odabraneKarte, setOdabraneKarte] = useState([]);

    async function ucitajKorisnike() {
        const o = await KorisnikService.get();
        if (o.success) setKorisnici(o.data);
    }

    async function ucitajDogadjaje() {
        const o = await DogadjajService.get();
        if (o.success) setDogadjaji(o.data);
    }

    async function ucitajKarte(dogadjajSifra) {
        const o = await KartaService.getByDogadjaj(dogadjajSifra);
        setKarte(o.data.filter(k => !k.rezervirano));
    }

    useEffect(() => {
        ucitajKorisnike();
        ucitajDogadjaje();
    }, []);

    async function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        const korisnik = parseInt(podaci.get("korisnik"));
        const dogadjaj = parseInt(podaci.get("dogadjaj"));

        if (!korisnik || !dogadjaj) {
            alert("Sve mora biti odabrano!");
            return;
        }

        const novaRez = {
            korisnikSifra: korisnik,
            dogadjajSifra: dogadjaj,
            brojeviKarata: odabraneKarte,
            datumRezervacije: new Date().toISOString()
        };

        const rez = await RezervacijaService.dodaj(novaRez);

        await KartaService.rezervirajKarte(
            dogadjaj,
            odabraneKarte,
            rez.data.sifra
        );

        navigate(RouteNames.REZERVACIJE);
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
                                    <Form.Select name="korisnik" required>
                                        <option value="">-- korisnik --</option>
                                        {korisnici.map(k => (
                                            <option key={k.sifra} value={k.sifra}>
                                                {k.ime} {k.prezime}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={6}>
                                    <Form.Select
                                        name="dogadjaj"
                                        required
                                        onChange={(e) => ucitajKarte(e.target.value)}
                                    >
                                        <option value="">-- događaj --</option>
                                        {dogadjaji.map(d => (
                                            <option key={d.sifra} value={d.sifra}>
                                                {d.naziv}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>

                            <hr />
                            <p className="text-muted small mb-2">
                                (CTRL za višestruki odabir)
                            </p>
                            <Form.Select
                                multiple
                                value={odabraneKarte}
                                onChange={(e) =>
                                    setOdabraneKarte(
                                        Array.from(e.target.selectedOptions, o => parseInt(o.value))
                                    )
                                }
                            >
                                {karte.map(k => (
                                    <option key={k.sifra} value={k.broj}>
                                        Karta broj {k.broj}
                                    </option>
                                ))}
                            </Form.Select>

                            <hr />

                            <Button type="submit">Spremi</Button>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    );
}