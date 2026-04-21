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
            <div className="d-flex justify-content-center my-1">
                <Link to={RouteNames.KORISNICI_NOVI} style={{ color: "#353535" }} className="fs-1">
                    <i className="bi bi-plus-circle-fill"></i>
                </Link>
            </div>

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
        </>
    );
}                               