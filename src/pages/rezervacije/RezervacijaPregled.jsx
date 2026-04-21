import { useEffect, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { NumericFormat } from "react-number-format"
import RezervacijaService from "../../services/rezervacije/RezervacijaService"
import DogadjajService from "../../services/dogadjaji/DogadjajService"
import KorisnikService from "../../services/korisnici/KorisnikService"
import { RouteNames } from "../../constants"
import FormatDatuma from "../../components/ForamtDatuma"
import KartaService from "../../services/karte/KartaService";
import "bootstrap-icons/font/bootstrap-icons.css";
import { RezervacijaPDFGenerator } from "../../components/RezervacijaPDFGenerator"


export default function RezervacijaPregled() {

    const navigate = useNavigate();

    const [rezervacije, setRezervacije] = useState([]);
    const [korisnici, setKorisnici] = useState([]);
    const [dogadjaji, setDogadjaji] = useState([]);
    const [karte, setKarte] = useState([]);

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

    async function ucitajKarte() {
        const odgovor = await KartaService.get();
        if (!odgovor.success) return;
        setKarte(odgovor.data);
    }

    useEffect(() => {
        ucitajRezervacije();
        ucitajKorisnike();
        ucitajDogadjaje();
        ucitajKarte();
    }, []);

    async function obrisi(sifra) {
        if (!confirm("Sigurno obrisati rezervaciju?")) return;
        await KartaService.oslobodiKarte(sifra);
        await RezervacijaService.obrisi(sifra);
        ucitajRezervacije();
        ucitajKarte();
    }

    function getSeatBoxes(rez, karte) {
        return karte.map(k => {
            let boja = "lightgreen"; // slobodno

            if (k.rezervirano) {
                if (rez.brojeviKarata?.includes(k.broj)) {
                    if (rez.evidentirano) {
                        boja = "yellow";
                    } else {
                        boja = "#428af7";
                    }
                }
                else {
                    boja = "red";
                }
            }

            return (
                <div
                    key={k.sifra}
                    style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: boja,
                        border: "1px solid #888",
                        fontSize: "10px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "content-box",
                        paddingRight: "2px",
                        paddingLeft: "2px",
                    }}

                >
                    {k.broj}
                </div>
            );
        });
    }



    return (
        <>
            <div className="d-flex justify-content-center my-1">
                <Link to={RouteNames.REZERVACIJE_NOVE} style={{ color: "#353535" }} className="fs-1">
                    <i className="bi bi-plus-circle-fill"></i>
                </Link>
            </div>

            <div className="d-flex flex-column gap-3 my-3">
                {rezervacije.map(rez => (
                    <div
                        key={rez.sifra}
                        className="p-3 border rounded shadow-sm"
                        style={{ backgroundColor: "#f8f9fa" }}
                    >
                        <Row className="mt-3">
                            <Col className="ms-3">
                                <h5 className="mb-3">
                                    {dogadjaji.find(d => d.sifra === rez.dogadjajSifra)?.naziv || "Nepoznat događaj"}
                                </h5>
                            </Col>
                            <Col>
                                <div className="d-flex gap-3 justify-content-end me-4">
                                    <i
                                        className="bi bi-pencil-square fs-4 text-primary"
                                        role="button"
                                        onClick={() => navigate(`/rezervacije/${rez.sifra}`)}
                                    ></i>

                                    <i
                                        className="bi bi-trash fs-4 text-danger"
                                        role="button"
                                        onClick={() => obrisi(rez.sifra)}
                                    ></i>

                                    <i
                                        className="bi bi-file-earmark-pdf fs-4 text-success"
                                        role="button"
                                        onClick={() =>
                                            RezervacijaPDFGenerator(
                                                rez,
                                                dogadjaji.find(d => d.sifra === rez.dogadjajSifra),
                                                korisnici.find(k => k.sifra === rez.korisnikSifra)
                                            )
                                        }
                                    >
                                    </i>
                                </div>

                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col className="ms-3">
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
                                            value={dogadjaji.find(d => d.sifra === rez.dogadjajSifra).cijena * rezervacije.find(r => r.sifra === rez.sifra).brojeviKarata.length}
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
                                    <strong>Status ulaza:</strong>{" "}
                                    {rez.evidentirano ? (
                                        <span style={{ color: "green", fontWeight: "bold" }}>
                                            Evidentirano ✓
                                        </span>
                                    ) : (
                                        <span>
                                            Nije evidentirano
                                        </span>
                                    )}
                                </div>

                                {rez.evidentirano && (
                                    <div>
                                        <strong>Datum evidentiranja:</strong>{" "}
                                        <FormatDatuma datum={rez.datumEvidentiranja} />
                                    </div>
                                )}


                                <div>
                                    <strong>Ukupan broj mjesta:</strong>{" "}
                                    {dogadjaji.find(d => d.sifra === rez.dogadjajSifra)
                                        ? `${dogadjaji.find(d => d.sifra === rez.dogadjajSifra).brojMjesta}` : "Nepoznato"
                                    }
                                </div>

                                <div>
                                    <strong>Vaše karte:</strong>{" "}
                                    {rez.brojeviKarata?.join(", ") || "-"}
                                </div>
                            </Col>
                            <Col>
                                <div>
                                    <strong>Rezervirana mjesta:</strong>
                                    <div className="d-flex flex-wrap gap-1 mt-2">
                                        {getSeatBoxes(
                                            rez,
                                            karte.filter(k => k.dogadjajSifra === rez.dogadjajSifra)
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    </div>
                ))}
            </div>
        </>
    )
}