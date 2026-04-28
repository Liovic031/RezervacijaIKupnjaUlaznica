import { use, useEffect, useState } from "react";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { Button, Table } from "react-bootstrap";
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

        return odgovor.data.filter(r => r.korisnikSifra === parseInt(sifraKorisnika)).length;
    }

    async function obrisi(sifra) {

        showLoading(); // Loader ON
        // samo za potrebe testa prikaza rada loading
        await new Promise(resolve => setTimeout(resolve, 2000));

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
            hideLoading(); // Loader OFF
            return;
        }

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
                <Link to={RouteNames.KORISNICI_NOVI} style={{ color: "#353535" }} className="fs-1 dodaj_item">
                    <i className="bi bi-plus-circle-fill"></i>
                </Link>
            </div>
            <div className="my-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Pretraži korisnike (ime, prezime, email)..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="table-responsive">
                <Table>
                    <thead>
                        <tr>
                            <th role="button" onClick={() => handleSort('ime')}>Ime {getSortIcon('ime')}</th>
                            <th role="button" onClick={() => handleSort('prezime')}>Prezime {getSortIcon('prezime')}</th>
                            <th role="button" onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
                            <th role="button" className="text-nowrap" onClick={() => handleSort('datumKreiranja')}>Kreiran {getSortIcon('datumKreiranja')}</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedKorisnici() && sortedKorisnici().slice(0, visibleCount).map((korisnik) => (
                            <tr key={korisnik.sifra}>
                                <td>{korisnik.ime}</td>
                                <td>{korisnik.prezime}</td>
                                <td>{korisnik.email}</td>
                                <td><FormatDatuma datum={korisnik.datumKreiranja} /></td>
                                <td>
                                    <i
                                        className="bi bi-pencil-square fs-4 text-primary"
                                        role="button"
                                        onClick={() => navigate(`/korisnici/${korisnik.sifra}`)}
                                    ></i>
                                    &nbsp;&nbsp;
                                    <i
                                        className="bi bi-trash fs-4 text-danger"
                                        role="button"
                                        onClick={() => obrisi(korisnik.sifra)}
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            {visibleCount < sortedKorisnici().length && (
                <div className="text-center mt-4">
                    <Button className="ucitaj" onClick={ucitajJos}>
                        Učitaj više
                    </Button>
                </div>
            )}
        </>
    );
}                               