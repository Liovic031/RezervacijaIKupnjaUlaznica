import { useEffect, useState } from "react"
import DogadjajService from "../../services/dogadjaji/DogadjajService"
import { Button, Card, CardBody, Col, Row } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import FormatDatuma from "../../components/ForamtDatuma"
import { GrClose, GrValidate } from "react-icons/gr"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css";
import RezervacijaService from "../../services/rezervacije/RezervacijaService"


export default function DogadjajPregled() {

    const navigate = useNavigate();

    //dohvaćanje podataka
    const [dogadjaji, setDogadjaji] = useState([]);

    async function ucitajDogadjaje() {
        const odgovor = await DogadjajService.get();
        if (!odgovor.success) {
            alert('Nije implementiran servis');
            return
        }
        setDogadjaji(odgovor.data);
    }

    useEffect(() => {

        ucitajDogadjaje();
    }, []);


    //brisanje podataka
    async function brojRezervacijaZaDogadjaj(sifraDogadjaja) {
        const odgovor = await RezervacijaService.get();
        if (!odgovor.success) return 0;

        return odgovor.data.filter(r => r.dogadjajSifra === parseInt(sifraDogadjaja)).length;
    }

    async function obrisi(sifra) {

        const broj = await brojRezervacijaZaDogadjaj(sifra);

        let poruka = 'Jeste li sigurni da želite obrisati događaj?';
        if (broj == 1){
            poruka = `Ovaj događaj ima ${broj} rezervaciju. Brisanjem događaja obrisat će se i rezervacija za događaj. Želite li nastaviti?`;
        }
        if (broj >= 2 && broj <= 4){
            poruka = `Ovaj događaj ima ${broj} rezervacije. Brisanjem događaja obrisat će se i rezervacije za događaj. Želite li nastaviti?`;
        }
        if (broj > 4) {
            poruka = `Ovaj događaj ima ${broj} rezervacija. Brisanjem događaja obrisat će se i sve rezervacije za događaj. Želite li nastaviti?`;
        }

        if (!confirm(poruka)) {
            return;
        }

        await DogadjajService.obrisi(sifra);
        ucitajDogadjaje();
    }


    const [visibleCount, setVisibleCount] = useState(12);
    const ucitajJos = () => {
        setVisibleCount(prev => prev + 9);
    };


    return (
        <>
            <div className="d-flex justify-content-center my-1">
                <Link to={RouteNames.DOGADJAJI_NOVI} className="fs-1 dodaj_item">
                    <i className="bi bi-plus-circle-fill"></i>
                </Link>
            </div>

            <Row xs={1} md={2} lg={3} xxl={4}>
                {dogadjaji && dogadjaji.slice(0, visibleCount).map((dogadjaj) => (
                    <Col key={dogadjaj.sifra} className="mb-4">
                        <Card className="card-dogadjaj h-100">

                            <div className="d-flex justify-content-between align-items-start p-3 card-header-line">
                                <Card.Title className="mt-1 fs-5">{dogadjaj.naziv}</Card.Title>
                                <div className="kartica_ikone d-flex gap-2">
                                    <i
                                        className="bi bi-pencil-square fs-4 text-primary"
                                        role="button"
                                        onClick={() => navigate(`/dogadjaji/${dogadjaj.sifra}`)}
                                    ></i>

                                    <i
                                        className="bi bi-trash fs-4 text-danger"
                                        role="button"
                                        onClick={() => obrisi(dogadjaj.sifra)}
                                    ></i>
                                </div>
                            </div>

                            <Card.Body className="pt-3">
                                <Card.Text>
                                    <span className="card-label">Lokacija:</span> {dogadjaj.lokacija}
                                </Card.Text>
                                <Card.Text>
                                    <span className="card-label">Datum održavanja:</span>{' '}
                                    <FormatDatuma datum={dogadjaj.datumOdrzavanja} />
                                </Card.Text>
                                <Card.Text>
                                    <span className="card-label">Broj slobodnih mjesta:</span> {dogadjaj.brojMjesta}
                                </Card.Text>
                                <Card.Text>
                                    <span className="card-label">Cijena:</span>{' '}
                                    <NumericFormat
                                        value={dogadjaj.cijena}
                                        displayType={'text'}
                                        thousandSeparator='.'
                                        decimalSeparator=','
                                        suffix={' €'}
                                        decimalScale={2}
                                        fixedDecimalScale
                                    />
                                </Card.Text>
                                <Card.Text>
                                    <span className="card-label">Aktivnost:</span>{' '}
                                    {dogadjaj.aktivan
                                        ? <GrValidate size={22} color='green' />
                                        : <GrClose size={22} color='red' />}
                                </Card.Text>
                            </Card.Body>

                        </Card>
                    </Col>

                ))}
            </Row>
            {visibleCount < dogadjaji.length && (
                <div className="text-center mt-4">
                    <Button className="ucitaj" onClick={ucitajJos}>
                        Učitaj više
                    </Button>
                </div>
            )}
        </>
    )
}                                  