import { useEffect, useState } from "react";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { Button, Table } from "react-bootstrap";
import FormatDatuma from "../../components/ForamtDatuma";
import { RouteNames } from "../../constants";
import { Link, useNavigate } from "react-router-dom";

export default function KorisnikPregled() {

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

    return (
        <>
            <Link to={RouteNames.KORISNICI_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje novog korisnika
            </Link>

            <Table>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Email</th>
                        <th>Kreiran</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {korisnici && korisnici.map((korisnik) => (
                        <tr key={korisnik.sifra}>
                            <td>{korisnik.ime}</td>
                            <td>{korisnik.prezime}</td>
                            <td>{korisnik.email}</td>
                            <td><FormatDatuma datum={korisnik.datumKreiranja} /></td>
                            <td>
                                <Button onClick={() => navigate(`/korisnici/${korisnik.sifra}`)}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                <Button variant="danger" onClick={() => obrisi(korisnik.sifra)}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}