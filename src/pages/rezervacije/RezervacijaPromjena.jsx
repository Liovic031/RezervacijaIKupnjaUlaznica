import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import KorisnikService from "../../services/korisnici/KorisnikService";
import DogadjajService from "../../services/dogadjaji/DogadjajService";
import KartaService from "../../services/karte/KartaService";

export default function RezervacijaPromjena() {

    const navigate = useNavigate();
    const params = useParams();

    const [rezervacija, setRezervacija] = useState(null);
    const [korisnici, setKorisnici] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);
    const [karte, setKarte] = useState([]);
    const [odabraneKarte, setOdabraneKarte] = useState([]);
    const [otvoreno, setOtvoreno] = useState(false);

    async function ucitajSve() {
        const r = await RezervacijaService.getBySifra(params.sifra);
        const k = await KorisnikService.get();
        const d = await DogadjajService.get();

        if (r.success) {
            setRezervacija(r.data);
            setOdabraneKarte(r.data.brojeviKarata || []);
            ucitajKarte(r.data.dogadjajSifra, r.data.sifra);
        }

        if (k.success) setKorisnici(k.data);
        if (d.success) setDogadjaji(d.data);
    }

    async function ucitajKarte(dogadjajSifra, rezSifra) {
        const o = await KartaService.getByDogadjaj(dogadjajSifra);

        const filtrirane = o.data.filter(k =>
            !k.rezervirano || k.rezervacijaSifra === rezSifra
        );

        setKarte(filtrirane);
    }

    useEffect(() => {
        ucitajSve();
    }, []);

    if (!rezervacija) return <p>Učitavanje...</p>;

    async function odradiSubmit(e) {
        e.preventDefault();
        const podaci = new FormData(e.target);

        const korisnik = parseInt(podaci.get("korisnik"));
        const dogadjaj = parseInt(podaci.get("dogadjaj"));

        // oslobodi stare
        await KartaService.oslobodiKarte(params.sifra);

        // spremi
        await RezervacijaService.promjeni(params.sifra, {
            korisnikSifra: korisnik,
            dogadjajSifra: dogadjaj,
            brojeviKarata: odabraneKarte
        });

        // rezerviraj nove
        await KartaService.rezervirajKarte(
            dogadjaj,
            odabraneKarte,
            params.sifra
        );

        navigate(RouteNames.REZERVACIJE);
    }

    return (
        <>
            <h3>Promjena rezervacije</h3>

            <Form onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">
                        <Card.Body>

                            <Row>
                                <Col md={6}>
                                    <Form.Select name="korisnik" defaultValue={rezervacija.korisnikSifra}>
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
                                        defaultValue={rezervacija.dogadjajSifra}
                                        onChange={(e) => ucitajKarte(e.target.value, params.sifra)}
                                    >
                                        {dogadjaji.map(d => (
                                            <option key={d.sifra} value={d.sifra}>
                                                {d.naziv}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>

                            <hr />
                            <div className="mb-3 position-relative">

                                <Button
                                    variant="secondary"
                                    onClick={() => setOtvoreno(!otvoreno)}
                                >
                                    Odaberi karte ({odabraneKarte.length})
                                </Button>

                                {otvoreno && (
                                    <div
                                        className="border rounded p-2 mt-2 bg-white"
                                        style={{
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            position: "absolute",
                                            zIndex: 1000,
                                            width: "100%"
                                        }}
                                    >
                                        {karte.map(k => (
                                            <Form.Check
                                                key={k.sifra}
                                                id={`karta-${k.sifra}`}
                                                type="checkbox"
                                                label={`Karta ${k.broj}`}
                                                checked={odabraneKarte.includes(k.broj)}
                                                disabled={
                                                    !odabraneKarte.includes(k.broj) && odabraneKarte.length >= 5
                                                }
                                                onChange={() => {
                                                    if (odabraneKarte.includes(k.broj)) {
                                                        setOdabraneKarte(odabraneKarte.filter(b => b !== k.broj));
                                                    } else {
                                                        if (odabraneKarte.length >= 5) {
                                                            alert("Max 5 karata!");
                                                            return;
                                                        }
                                                        setOdabraneKarte([...odabraneKarte, k.broj]);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                            </div>

                            <hr />

                            <Button type="submit">Spremi</Button>

                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    );
}