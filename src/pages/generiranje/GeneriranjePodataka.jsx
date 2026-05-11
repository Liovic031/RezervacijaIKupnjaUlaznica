import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Faker, hr, en } from "@faker-js/faker";

import DogadjajService from "../../services/dogadjaji/DogadjajService";
import KorisnikService from "../../services/korisnici/KorisnikService";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import KartaService from "../../services/karte/KartaService";

import { PrefixStorage } from "../../constants";

// memorijski podaci
import { dogadjaji as dogadjajiMem } from "../../services/dogadjaji/DogadjajPodaci";
import { korisnici as korisniciMem } from "../../services/korisnici/KorisnikPodaci";
import { karte as karteMem } from "../../services/karte/KartaPodaci";
import { rezervacije as rezervacijeMem } from "../../services/rezervacije/RezervacijaPodaci";

import DogadjajServiceFireBase from "../../services/dogadjaji/DogadjajServiceFireBase";
import KorisnikServiceFireBase from "../../services/korisnici/KorisnikServiceFireBase";
import KartaServiceFireBase from "../../services/karte/KartaServiceFireBase";
import RezervacijaServiceFireBase from "../../services/rezervacije/RezervacijaServiceFireBase";


// slika
const defaultSlika = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEsCAIAAAAJmGvpAAADD0lEQVR4nO3SQQ0AIRDAwOP8C1tZmKAhITMK+uiamQ9O+28H8CZjkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBaJDVgNBLAk8IkcAAAAAElFTkSuQmCC';



export default function GeneriranjePodataka() {

    const faker = new Faker({ locale: [hr, en] });

    const [brojDogadjaja, setBrojDogadjaja] = useState(5);
    const [brojKorisnika, setBrojKorisnika] = useState(10);
    const [brojRezervacija, setBrojRezervacija] = useState(10);

    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    const naziviDogadjaja = [
        'Tech konferencija', 'AI Summit', 'Frontend Meetup', 'Backend Meetup',
        'JavaScript Day', 'Python Workshop', 'Cyber Security Forum',
        'Startup Pitch Night', 'Gaming Expo', 'Retro Gaming Night',
        'Stand-up večer', 'Jazz Night', 'Rock koncert', 'EDM Festival',
        'Film Premiere', 'Kazališna predstava', 'Salsa Night', 'Wine Tasting',
        'Food Festival', 'Book Fair', 'Photography Expo', 'Design Conference',
        'Marketing Summit', 'Business Networking Event'
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
                lozinka: "Test123!", // svi generirani korisnici imaju istu lozinku
                datumKreiranja: new Date().toISOString(),
                uloga: "korisnik",
                slika: defaultSlika
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

            await KartaService.generirajZaDogadjaj(dogadjaj.sifra);

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
    // PRETAKANJE MEMORIJE → LOCALSTORAGE
    // -------------------------------------------------------
    const handleMemorijaULocalStorage = async () => {
        if (!window.confirm("Jeste li sigurni da želite pretočiti podatke iz memorije u localStorage?")) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            // 1) DOGAĐAJI
            localStorage.setItem(PrefixStorage.DOGADJAJI, JSON.stringify(dogadjajiMem));

            // 2) KORISNICI
            localStorage.setItem(PrefixStorage.KORISNICI, JSON.stringify(korisniciMem));

            // 3) KARTE
            localStorage.setItem(PrefixStorage.KARTE, JSON.stringify(karteMem));

            // 4) REZERVACIJE
            localStorage.setItem(PrefixStorage.REZERVACIJE, JSON.stringify(rezervacijeMem));

            setPoruka({
                tip: "success",
                tekst: "Uspješno presipano iz memorije u localStorage!"
            });

        } catch (err) {
            setPoruka({
                tip: "danger",
                tekst: "Greška pri presipavanju: " + err.message
            });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // PRETAKANJE MEMORIJE → FIREBASE
    // -------------------------------------------------------
    const handleMemorijaUFirebase = async () => {
        if (!window.confirm("Jeste li sigurni da želite pretočiti podatke iz memorije u Firebase?")) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            // -----------------------------
            // 1) KORISNICI → Firebase
            // -----------------------------
            let mapKorisnici = [];

            for (const k of korisniciMem) {
                const { sifra, ...ostatak } = k;

                const fb = await KorisnikServiceFireBase.dodaj({
                    ...ostatak,
                    datumKreiranja: ostatak.datumKreiranja
                });

                mapKorisnici.push({
                    stara: sifra,
                    nova: fb.data.sifra
                });
            }


            // -----------------------------
            // 2) DOGAĐAJI → Firebase
            // -----------------------------
            let mapDogadjaji = [];

            for (const d of dogadjajiMem) {
                const { sifra, ...ostatak } = d;

                const fb = await DogadjajServiceFireBase.dodaj({
                    ...ostatak,
                    datumOdrzavanja: ostatak.datumOdrzavanja
                });

                mapDogadjaji.push({
                    stara: sifra,
                    nova: fb.data.sifra
                });
            }



            // -----------------------------
            // 3) KARTE → Firebase
            // -----------------------------
            let mapKarte = [];

            for (const k of karteMem) {
                const { sifra, ...ostatak } = k;

                // mapiraj dogadjajSifra
                const noviDogadjaj = mapDogadjaji.find(m => m.stara === ostatak.dogadjajSifra);
                ostatak.dogadjajSifra = noviDogadjaj?.nova || null;

                const fb = await KartaServiceFireBase.dodaj(ostatak);

                mapKarte.push({
                    stara: sifra,
                    nova: fb.data.sifra
                });
            }


            // -----------------------------
            // 4) REZERVACIJE → Firebase
            // -----------------------------
            for (const r of rezervacijeMem) {
                const { sifra, ...ostatak } = r;

                // mapiraj korisnikSifra
                const noviKorisnik = mapKorisnici.find(m => m.stara === ostatak.korisnikSifra);
                ostatak.korisnikSifra = noviKorisnik?.nova || null;

                // mapiraj dogadjajSifra
                const noviDogadjaj = mapDogadjaji.find(m => m.stara === ostatak.dogadjajSifra);
                ostatak.dogadjajSifra = noviDogadjaj?.nova || null;

                // mapiraj brojeve karata → rezervacijaSifra će se postaviti kasnije
                const fb = await RezervacijaServiceFireBase.dodaj(ostatak);

                await KartaServiceFireBase.rezervirajKarte(
                    ostatak.dogadjajSifra,
                    ostatak.brojeviKarata,
                    fb.data.sifra
                );
            }

            setPoruka({
                tip: "success",
                tekst: "Uspješno presipano iz memorije u Firebase!"
            });

        } catch (err) {
            console.error("Greška pri presipavanju:", err);
            setPoruka({
                tip: "danger",
                tekst: "Greška pri presipavanju: " + err.message
            });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // BRISANJE SVIH PODATAKA
    // -------------------------------------------------------
    const obrisiSve = () => {
        localStorage.removeItem(PrefixStorage.DOGADJAJI);
        localStorage.removeItem(PrefixStorage.KORISNICI);
        localStorage.removeItem(PrefixStorage.KARTE);
        localStorage.removeItem(PrefixStorage.REZERVACIJE);

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

            <Row className="mt-4">
                <Col md={6}>
                    <Button
                        variant="success"
                        className="w-100 mb-2"
                        disabled={loading}
                        onClick={handleMemorijaULocalStorage}
                    >
                        {loading ? "Pretakanje..." : "Iz memorije u localStorage"}
                    </Button>
                </Col>

                <Col md={6}>
                    <Button
                        variant="primary"
                        className="w-100 mb-2"
                        disabled={loading}
                        onClick={handleMemorijaUFirebase}
                    >
                        {loading ? "Pretakanje..." : "Iz memorije u Firebase"}
                    </Button>

                </Col>
            </Row>

            <Button variant="danger" className="w-100 mt-3" onClick={obrisiSve}>
                Obriši sve podatke
            </Button>
        </Container>
    );
}
