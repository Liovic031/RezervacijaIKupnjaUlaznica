import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import KorisnikService from "../../services/korisnici/KorisnikService";
import DogadjajService from "../../services/dogadjaji/DogadjajService";
import KartaService from "../../services/karte/KartaService";
import { ShemaRezervacija } from "../../schemas/ShemaRezervacija";

export default function RezervacijaPromjena() {

    const navigate = useNavigate();
    const params = useParams();

    const [rezervacija, setRezervacija] = useState(null);
    const [korisnici, setKorisnici] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);
    const [karte, setKarte] = useState([]);
    const [odabraneKarte, setOdabraneKarte] = useState([]);
    const [otvoreno, setOtvoreno] = useState(false);
    const [errors, setErrors] = useState({});

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
        const dog = await DogadjajService.getBySifra(dogadjajSifra);

        if (!dog.success) return;

        const maxBroj = dog.data.brojMjesta;

        const filtrirane = o.data
            .filter(k => k.broj <= maxBroj)
            .filter(k =>
                !k.rezervirano ||
                k.rezervacijaSifra === rezSifra ||
                odabraneKarte.includes(k.broj)
            );

        setKarte(filtrirane);
    }

    useEffect(() => {
        ucitajSve();
    }, []);

    if (!rezervacija) return <p>Učitavanje...</p>;

    async function odradiSubmit(e) {
        e.preventDefault();
        setErrors({});

        const podaci = new FormData(e.target);
        const objekt = Object.fromEntries(podaci);

        objekt.korisnikSifra = objekt.korisnik;
        objekt.dogadjajSifra = objekt.dogadjaj;

        // 1) ZOD VALIDACIJA
        const rezultat = ShemaRezervacija.safeParse(objekt);

        if (!rezultat.success) {
            const greske = {};
            rezultat.error.issues.forEach(issue => {
                const kljuc = issue.path[0];
                greske[kljuc] = issue.message;
            });
            setErrors(greske);
            return;
        }

        // 2) VALIDACIJA KARATA
        if (odabraneKarte.length === 0) {
            setErrors(prev => ({ ...prev, karte: "Odaberite barem jednu kartu!" }));
            return;
        }

        // 3) Oslobodi stare karte
        await KartaService.oslobodiKarte(params.sifra);

        // 4) Spremi rezervaciju
        await RezervacijaService.promjeni(params.sifra, {
            korisnikSifra: rezultat.data.korisnikSifra,
            dogadjajSifra: rezultat.data.dogadjajSifra,
            brojeviKarata: odabraneKarte
        });

        // 5) Rezerviraj nove karte
        await KartaService.rezervirajKarte(
            rezultat.data.dogadjajSifra,
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
                                    <Form.Label>Korisnik</Form.Label>
                                    <Form.Select
                                        name="korisnik"
                                        defaultValue={rezervacija.korisnikSifra}
                                        isInvalid={!!errors.korisnikSifra}
                                    >
                                        {korisnici.map(k => (
                                            <option key={k.sifra} value={k.sifra}>
                                                {k.ime} {k.prezime}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.korisnikSifra}
                                    </Form.Control.Feedback>
                                </Col>

                                <Col md={6}>
                                    <Form.Label>Događaj</Form.Label>
                                    <Form.Select
                                        name="dogadjaj"
                                        defaultValue={rezervacija.dogadjajSifra}
                                        isInvalid={!!errors.dogadjajSifra}
                                        onChange={(e) => ucitajKarte(e.target.value, params.sifra)}
                                    >
                                        {dogadjaji.map(d => (
                                            <option key={d.sifra} value={d.sifra}>
                                                {d.naziv}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.dogadjajSifra}
                                    </Form.Control.Feedback>
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

                                {errors.karte && (
                                    <div className="text-danger mt-1">{errors.karte}</div>
                                )}

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
                                                    !odabraneKarte.includes(k.broj) &&
                                                    odabraneKarte.length >= 5
                                                }
                                                onChange={() => {
                                                    if (odabraneKarte.includes(k.broj)) {
                                                        setOdabraneKarte(
                                                            odabraneKarte.filter(b => b !== k.broj)
                                                        );
                                                    } else {
                                                        if (odabraneKarte.length >= 5) {
                                                            return;
                                                        }
                                                        setOdabraneKarte([
                                                            ...odabraneKarte,
                                                            k.broj
                                                        ]);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <hr />

                            <div className="d-flex justify-content-start gap-2 mt-3">
                                <Button type="submit" variant="success">
                                    Spremi
                                </Button>

                                <Link to={RouteNames.REZERVACIJE} className="btn btn-danger">
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
