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
    const [otvoreno, setOtvoreno] = useState(false);

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

        if (odabraneKarte.length === 0) {
            alert("Odaberi barem jednu kartu!");
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