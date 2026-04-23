import { use, useEffect, useState } from "react";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { Button, Table } from "react-bootstrap";
import FormatDatuma from "../../components/ForamtDatuma";
import { RouteNames } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

export default function KorisnikPregled() {
    //dohvacanje i brisanje korisnika
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
    async function obrisi(sifra) {
        if (!confirm('Sigurno obrisati?')) {
            return;
        }
        await KorisnikService.obrisi(sifra);
        ucitajKorisnike();
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
        if (!korisnici || sortConfig.direction === null) {
            return korisnici;
        }

        const sorted = [...korisnici].sort((a, b) => {
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

    return (
        <>
            <div className="d-flex justify-content-center my-1">
                <Link to={RouteNames.KORISNICI_NOVI} style={{ color: "#353535" }} className="fs-1 dodaj_item">
                    <i className="bi bi-plus-circle-fill"></i>
                </Link>
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
                        {sortedKorisnici() && sortedKorisnici().map((korisnik) => (
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
        </>
    );
}                               