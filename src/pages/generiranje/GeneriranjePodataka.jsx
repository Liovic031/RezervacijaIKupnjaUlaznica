import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Faker, hr, en } from "@faker-js/faker";

import DogadjajService from "../../services/dogadjaji/DogadjajService";
import KorisnikService from "../../services/korisnici/KorisnikService";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import KartaService from "../../services/karte/KartaService";

export default function GeneriranjePodataka() {

    const faker = new Faker({ locale: [hr, en] });

    const [brojDogadjaja, setBrojDogadjaja] = useState(5);
    const [brojKorisnika, setBrojKorisnika] = useState(10);
    const [brojRezervacija, setBrojRezervacija] = useState(10);

    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    const naziviDogadjaja = [
        'Tech konferencija',
        'AI Summit',
        'Frontend Meetup',
        'Backend Meetup',
        'JavaScript Day',
        'Python Workshop',
        'Cyber Security Forum',
        'Startup Pitch Night',
        'Gaming Expo',
        'Retro Gaming Night',
        'Stand-up večer',
        'Jazz Night',
        'Rock koncert',
        'EDM Festival',
        'Film Premiere',
        'Kazališna predstava',
        'Salsa Night',
        'Wine Tasting',
        'Food Festival',
        'Book Fair',
        'Photography Expo',
        'Design Conference',
        'Marketing Summit',
        'Business Networking Event'
    ];

    // -------------------------------------------------------
    // GENERIRANJE DOGAĐAJA
    // -------------------------------------------------------
    const generirajDogadjaje = async (broj) => {
        for (let i = 0; i < broj; i++) {

            const naziv = naziviDogadjaja[i % naziviDogadjaja.length]
                + " "
                + faker.number.int({ min: 1, max: 999 });

            const dogadjaj = {
                naziv,
                lokacija: faker.location.city(),
                datumOdrzavanja: faker.date.soon().toISOString(),
                opis: faker.lorem.sentence(),
                brojMjesta: faker.number.int({ min: 50, max: 500 }),
                cijena: faker.number.float({ min: 5, max: 200, precision: 0.01 }),
                aktivan: faker.datatype.boolean()
            };

            const rezultat = await DogadjajService.dodaj(dogadjaj);

            await KartaService.generirajZaDogadjaj(rezultat.data);
        }
    };


    const handleGenerirajDogadjaje = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajDogadjaje(brojDogadjaja);
            setPoruka({ tip: "success", tekst: `Generirano ${brojDogadjaja} događaja!` });
        } catch (err) {
            setPoruka({ tip: "danger", tekst: "Greška: " + err.message });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // GENERIRANJE KORISNIKA
    // -------------------------------------------------------
    const generirajKorisnike = async (broj) => {
        for (let i = 0; i < broj; i++) {
            await KorisnikService.dodaj({
                ime: faker.person.firstName(),
                prezime: faker.person.lastName(),
                email: faker.internet.email(),
                datumKreiranja: new Date().toISOString()
            });
        }
    };

    const handleGenerirajKorisnike = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajKorisnike(brojKorisnika);
            setPoruka({ tip: "success", tekst: `Generirano ${brojKorisnika} korisnika!` });
        } catch (err) {
            setPoruka({ tip: "danger", tekst: "Greška: " + err.message });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // GENERIRANJE REZERVACIJA
    // -------------------------------------------------------
    const generirajRezervacije = async (broj) => {
        const dogadjaji = (await DogadjajService.get()).data;
        const korisnici = (await KorisnikService.get()).data;

        if (dogadjaji.length === 0) throw new Error("Nema događaja!");
        if (korisnici.length === 0) throw new Error("Nema korisnika!");

        for (let i = 0; i < broj; i++) {

            const dogadjaj = faker.helpers.arrayElement(dogadjaji);
            const korisnik = faker.helpers.arrayElement(korisnici);

            // generiraj karte ako nisu generirane
            await KartaService.generirajZaDogadjaj(dogadjaj);

            const sveKarte = (await KartaService.getByDogadjaj(dogadjaj.sifra)).data;
            const slobodne = sveKarte.filter(k => !k.rezervirano);

            if (slobodne.length === 0) continue;

            const brojKarata = faker.number.int({ min: 1, max: Math.min(5, slobodne.length) });
            const odabrane = slobodne.slice(0, brojKarata).map(k => k.broj);

            const novaRez = {
                korisnikSifra: korisnik.sifra,
                dogadjajSifra: dogadjaj.sifra,
                brojeviKarata: odabrane,
                datumRezervacije: new Date().toISOString(),
                evidentirano: false,
                datumEvidentiranja: null
            };

            const rez = await RezervacijaService.dodaj(novaRez);

            await KartaService.rezervirajKarte(
                dogadjaj.sifra,
                odabrane,
                rez.data.sifra
            );
        }
    };

    const handleGenerirajRezervacije = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            await generirajRezervacije(brojRezervacija);
            setPoruka({ tip: "success", tekst: `Generirano ${brojRezervacija} rezervacija!` });
        } catch (err) {
            setPoruka({ tip: "danger", tekst: "Greška: " + err.message });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // BRISANJE SVIH PODATAKA
    // -------------------------------------------------------
    const obrisiSve = () => {
        localStorage.removeItem("dogadjaji");
        localStorage.removeItem("korisnici");
        localStorage.removeItem("karte");
        localStorage.removeItem("rezervacije");

        setPoruka({ tip: "warning", tekst: "Svi podaci obrisani!" });
    };

    // -------------------------------------------------------
    // RENDER
    // -------------------------------------------------------
    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={4}>
                    <Form onSubmit={handleGenerirajDogadjaje}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj događaja</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojDogadjaja}
                                onChange={(e) => setBrojDogadjaja(parseInt(e.target.value))}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button className="w-100" type="submit" disabled={loading}>
                            Generiraj događaje
                        </Button>
                    </Form>
                </Col>

                <Col md={4}>
                    <Form onSubmit={handleGenerirajKorisnike}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj korisnika</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojKorisnika}
                                onChange={(e) => setBrojKorisnika(parseInt(e.target.value))}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button className="w-100" type="submit" disabled={loading}>
                            Generiraj korisnike
                        </Button>
                    </Form>
                </Col>

                <Col md={4}>
                    <Form onSubmit={handleGenerirajRezervacije}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj rezervacija</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="200"
                                value={brojRezervacija}
                                onChange={(e) => setBrojRezervacija(parseInt(e.target.value))}
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button className="w-100" type="submit" disabled={loading}>
                            Generiraj rezervacije
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Button variant="danger" className="w-100" onClick={obrisiSve}>
                Obriši sve podatke
            </Button>
        </Container>
    );
}
