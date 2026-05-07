import { use, useEffect, useState } from "react";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { Button, Row, Col, Card } from "react-bootstrap";
import FormatDatuma from "../../components/ForamtDatuma";
import { RouteNames } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import useLoading from "../../hooks/useLoading";

export default function KorisnikPregled() {
    //loader
    const { showLoading, hideLoading } = useLoading();

    //dohvacanje
    const navigate = useNavigate();
    const [korisnici, setKorisnici] = useState([]);
    async function ucitajKorisnike() {
        const odgovor = await KorisnikService.get();
        if (!odgovor.success) {
            alert('Nije implementiran servis');
            return;
        }
        setKorisnici(odgovor.data);
    }
    useEffect(() => {
        ucitajKorisnike();
    }, []);

    //brisanje korisnika
    async function brojRezervacijaKorisnika(sifraKorisnika) {
        const odgovor = await RezervacijaService.get();
        if (!odgovor.success) return 0;

        return odgovor.data.filter(r => String(r.korisnikSifra) === String(sifraKorisnika)).length;
    }

    async function obrisi(sifra) {

        const broj = await brojRezervacijaKorisnika(sifra);

        let poruka = 'Jeste li sigurni da želite obrisati događaj?';

        if (broj == 1) {
            poruka = `Ovaj korisnik ima ${broj} rezervaciju. Brisanjem korisnika obrisat će se i njegova rezervacija. Želite li nastaviti?`;
        }
        if (broj >= 2 && broj <= 4) {
            poruka = `Ovaj korisnik ima ${broj} rezervacije. Brisanjem korisnika obrisat će se i sve njegove rezervacije. Želite li nastaviti?`;
        }
        if (broj > 4) {
            poruka = `Ovaj korisnik ima ${broj} rezervacija. Brisanjem korisnika obrisat će se i sve njegove rezervacije. Želite li nastaviti?`;
        }

        if (!confirm(poruka)) {
            return;
        }
        showLoading(); // Loader ON
        // samo za potrebe testa prikaza rada loading
        await new Promise(resolve => setTimeout(resolve, 2000));

        await KorisnikService.obrisi(sifra);
        ucitajKorisnike();

        hideLoading(); // Loader OFF
    }

    //sortiranje korisnika
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key != columnKey || sortConfig.direction === null) {
            return <FaSort />
        }
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
    }

    const sortedKorisnici = () => {
        const lista = filtriraniKorisnici();

        if (!lista || sortConfig.direction === null) {
            return lista;
        }

        const sorted = [...lista].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // obrada null/undefined vrijednosti
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Sortiranje prema tipu podatka: Date
            if (sortConfig.key === 'datumKreiranja') {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Sortiranje prema tipu podatka: string
            if (typeof aValue === 'string') {
                const result = aValue.localeCompare(bValue, 'hr', { sensitivity: 'accent' });
                return sortConfig.direction === 'asc' ? result : -result;
            }
            return 0;
        });

        return sorted;
    }

    //ucitaj jos
    const [visibleCount, setVisibleCount] = useState(15);
    const ucitajJos = () => {
        setVisibleCount(prev => prev + 15);
    };

    // search korisnika
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setVisibleCount(15); // reset paginacije
    };
    const filtriraniKorisnici = () => {
        if (!searchTerm.trim()) return korisnici;

        const term = searchTerm.toLowerCase().trim();

        return korisnici.filter(k =>
            (k.ime || '').toLowerCase().includes(term) ||
            (k.prezime || '').toLowerCase().includes(term) ||
            (k.email || '').toLowerCase().includes(term)
        );
    };




    return (
        <>
            <div className="d-flex justify-content-center my-1">
                <Link to={RouteNames.KORISNICI_NOVI} className="fs-1 dodaj_item" style={{ color: "#353535" }}>
                    <i className="bi bi-plus-circle-fill"></i>
                </Link>
            </div>
            <div className="d-flex justify-content-end mb-3">
                <select
                    className="form-select w-auto"
                    value={sortConfig.key || ""}
                    onChange={(e) => handleSort(e.target.value)}
                >
                    <option value="">Sortiraj...</option>
                    <option value="ime">Ime</option>
                    <option value="prezime">Prezime</option>
                    <option value="email">Email</option>
                    <option value="datumKreiranja">Datum kreiranja</option>
                </select>
            </div>

            <Row xs={1} md={2} lg={3} xxl={4}>
                {sortedKorisnici() && sortedKorisnici().slice(0, visibleCount).map((korisnik) => (
                    <Col key={korisnik.sifra} className="mb-4">
                        <Card className="card-korisnik h-100">

                            <img
                                src={korisnik.slika}
                                alt="korisnik"
                                className="card-korisnik-img"
                            />

                            <div className="d-flex justify-content-between align-items-start p-3 card-korisnik-header">
                                <Card.Title className="mt-1 fs-5">
                                    {korisnik.ime} {korisnik.prezime}
                                </Card.Title>

                                <div className="kartica_ikone d-flex gap-2">
                                    <i
                                        className="bi bi-pencil-square fs-4 text-primary"
                                        role="button"
                                        onClick={() => navigate(`/korisnici/${korisnik.sifra}`)}
                                    ></i>

                                    <i
                                        className="bi bi-trash fs-4 text-danger"
                                        role="button"
                                        onClick={() => obrisi(korisnik.sifra)}
                                    ></i>
                                </div>
                            </div>

                            <Card.Body className="pt-3">
                                <Card.Text>
                                    <span className="card-korisnik-label">Email:</span> {korisnik.email}
                                </Card.Text>

                                <Card.Text>
                                    <span className="card-korisnik-label">Kreiran:</span>{" "}
                                    <FormatDatuma datum={korisnik.datumKreiranja} />
                                </Card.Text>

                                <Card.Text>
                                    <span className="card-korisnik-label">Uloga:</span>{" "}
                                    {korisnik.uloga === "admin" ? (
                                        <span className="text-danger fw-bold">Admin</span>
                                    ) : (
                                        "Korisnik"
                                    )}
                                </Card.Text>
                            </Card.Body>

                        </Card>
                    </Col>
                ))}
            </Row>


            {visibleCount < korisnici.length && (
                <div className="text-center mt-4">
                    <Button className="ucitaj" onClick={ucitajJos}>
                        Učitaj više
                    </Button>
                </div>
            )}
        </>

    );
}                               