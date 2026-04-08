import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { NumericFormat } from "react-number-format"
import RezervacijaService from "../../services/rezervacije/RezervacijaService"
import DogadjajService from "../../services/dogadjaji/DogadjajService"
import KorisnikService from "../../services/korisnici/KorisnikService"
import { RouteNames } from "../../constants"
import FormatDatuma from "../../components/ForamtDatuma"

export default function RezervacijaPregled() {

    const navigate = useNavigate();

    const [rezervacije, setRezervacije] = useState([]);
    const [korisnici, setKorisnici] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);

    // Učitavanje podataka
    async function ucitajRezervacije() {
        const odgovor = await RezervacijaService.get();
        if (!odgovor.success) return;
        setRezervacije(odgovor.data);
    }

    async function ucitajDogadjaje() {
        const odgovor = await DogadjajService.get();
        if (!odgovor.success) return;
        setDogadjaji(odgovor.data);
    }

    async function ucitajKorisnike() {
        const odgovor = await KorisnikService.get();
        if (!odgovor.success) return;
        setKorisnici(odgovor.data);
    }

    useEffect(() => {
        ucitajRezervacije();
        ucitajKorisnike();
        ucitajDogadjaje();
    }, []);

    async function obrisi(sifra) {
        if (!confirm("Sigurno obrisati rezervaciju?")) return;
        await RezervacijaService.obrisi(sifra);
        ucitajRezervacije();
    }


    return (
        <>
            <Link to={RouteNames.REZERVACIJE_NOVE} className="btn btn-success w-100 my-3">
                Dodavanje nove rezervacije
            </Link>

            <div className="d-flex flex-column gap-3 my-3">
                {rezervacije.map(rez => (
                    <div
                        key={rez.sifra}
                        className="p-3 border rounded shadow-sm"
                        style={{ backgroundColor: "#f8f9fa" }}
                    >
                        <h5 className="mb-3">
                            {dogadjaji.find(d => d.sifra === rez.dogadjajSifra)?.naziv || "Nepoznat događaj"}
                        </h5>

                        <div>
                            <strong>Datum događaja:</strong>{" "}
                            {dogadjaji.find(d => d.sifra === rez.dogadjajSifra) ? (
                                <FormatDatuma datum={dogadjaji.find(d => d.sifra === rez.dogadjajSifra).datumOdrzavanja} />
                            ) : "?"}
                        </div>

                        <div>
                            <strong>Cijena:</strong>{" "}
                            {dogadjaji.find(d => d.sifra === rez.dogadjajSifra) ? (
                                <NumericFormat
                                    value={dogadjaji.find(d => d.sifra === rez.dogadjajSifra).cijena}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    suffix={' €'}
                                    decimalScale={2}
                                    fixedDecimalScale
                                />
                            ) : "?"}
                        </div>

                        <div>
                            <strong>Korisnik:</strong>{" "}
                            {korisnici.find(k => k.sifra === rez.korisnikSifra)
                                ? `${korisnici.find(k => k.sifra === rez.korisnikSifra).ime} ${korisnici.find(k => k.sifra === rez.korisnikSifra).prezime}`
                                : "Nepoznato"}
                        </div>

                        <div>
                            <strong>Datum rezervacije:</strong>{" "}
                            <FormatDatuma datum={rez.datumRezervacije} />
                        </div>

                        <div>
                            <strong>Slobodna mjesta:</strong>{" "}
                            {dogadjaji.find(d => d.sifra === rez.dogadjajSifra)
                            ? `${dogadjaji.find(d => d.sifra === rez.dogadjajSifra).dostupnoMjesta}` : "Nepoznato"
                            }
                        </div>
                        <div>
                            <strong>Slobodna mjesta:</strong>{" "}
                            {dogadjaji.find(d => d.sifra === rez.dogadjajSifra)
                            ? `${dogadjaji.find(d => d.sifra === rez.dogadjajSifra).brojMjesta}` : "Nepoznato"
                            }
                        </div>

                        <div className="mt-3 d-flex gap-2">
                            <Button onClick={() => navigate(`/rezervacije/${rez.sifra}`)}>Promjena</Button>
                            <Button variant="danger" onClick={() => obrisi(rez.sifra)}>Obriši</Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}