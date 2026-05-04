import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RouteNames } from "../../constants";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import KorisnikService from "../../services/korisnici/KorisnikService";
import DogadjajService from "../../services/dogadjaji/DogadjajService";
import KartaService from "../../services/karte/KartaService";
import { ShemaRezervacija } from "../../schemas/ShemaRezervacija";

export default function RezervacijaNova() {

    const navigate = useNavigate();

    const [korisnici, setKorisnici] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);
    const [karte, setKarte] = useState([]);
    const [odabraneKarte, setOdabraneKarte] = useState([]);
    const [otvoreno, setOtvoreno] = useState(false);
    const [errors, setErrors] = useState({});

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
        const rezervacije = await RezervacijaService.get();
        const dog = await DogadjajService.getBySifra(dogadjajSifra);

        if (!dog.success) return;

        const maxBroj = dog.data.brojMjesta;

        const filtrirane = o.data
            .filter(k => k.broj <= maxBroj)
            .filter(k =>
                !k.rezervirano ||
                !rezervacije.data.some(r => r.sifra === k.rezervacijaSifra)
            );

        setKarte(filtrirane);
    }

    useEffect(() => {
        ucitajKorisnike();
        ucitajDogadjaje();
    }, []);

    async function odradiSubmit(e) {
        e.preventDefault();
        setErrors({});

        const podaci = new FormData(e.target);
        const objekt = Object.fromEntries(podaci);

        // Pretvorba u brojeve
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

        // 2) VALIDACIJA KARATA (dinamička)
        if (odabraneKarte.length === 0) {
            setErrors(prev => ({ ...prev, karte: "Odaberite barem jednu kartu!" }));
            return;
        }

        // 3) Slanje rezervacije
        const novaRez = {
            korisnikSifra: rezultat.data.korisnikSifra,
            dogadjajSifra: rezultat.data.dogadjajSifra,
            brojeviKarata: odabraneKarte,
            datumRezervacije: new Date().toISOString()
        };

        const rez = await RezervacijaService.dodaj(novaRez);

        await KartaService.rezervirajKarte(
            rezultat.data.dogadjajSifra,
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
                                    <Form.Label>Korisnik</Form.Label>
                                    <Form.Select
                                        name="korisnik"
                                        isInvalid={!!errors.korisnikSifra}
                                    >
                                        <option value="">Odaberite korisnika</option>
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
                                        isInvalid={!!errors.dogadjajSifra}
                                        onChange={(e) => ucitajKarte(e.target.value)}
                                    >
                                        <option value="">Odaberite događaj</option>
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
