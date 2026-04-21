import { useEffect, useState } from "react"
import DogadjajService from "../../services/dogadjaji/DogadjajService"
import { Button, Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import FormatDatuma from "../../components/ForamtDatuma"
import { GrClose, GrValidate } from "react-icons/gr"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap-icons/font/bootstrap-icons.css";


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
    async function obrisi(sifra) {
        if (!confirm('sigurno obrisati')) {
            return
        }
        await DogadjajService.obrisi(sifra)
        ucitajDogadjaje()
    }


    return (
        <>
            <div className="d-flex justify-content-center my-1">
                <Link to={RouteNames.DOGADJAJI_NOVI} style={{ color: "#353535" }} className="fs-1">
                    <i className="bi bi-plus-circle-fill"></i>
                </Link>
            </div>

            <Table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Lokacija</th>
                        <th>Datum</th>
                        <th>Broj mjesta</th>
                        <th>Cijena</th>
                        <th>Aktivan</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {dogadjaji && dogadjaji.map((dogadjaj) => (
                        <tr key={dogadjaj.sifra}>
                            <td>{dogadjaj.naziv}</td>
                            <td>{dogadjaj.lokacija}</td>
                            <td><FormatDatuma datum={dogadjaj.datumOdrzavanja} /></td>
                            <td>{dogadjaj.brojMjesta}</td>
                            <td>
                                <NumericFormat
                                    value={dogadjaj.cijena}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    suffix={' €'}
                                    decimalScale={2}
                                    fixedDecimalScale
                                />
                            </td>
                            <td>{dogadjaj.aktivan ? <GrValidate size={25} color='green' /> : <GrClose size={25} color='red' />}</td>
                            <td>
                                <i
                                    className="bi bi-pencil-square fs-4 text-primary"
                                    role="button"
                                    onClick={() => navigate(`/dogadjaji/${dogadjaj.sifra}`)}
                                ></i>
                                &nbsp;&nbsp;
                                <i
                                    className="bi bi-trash fs-4 text-danger"
                                    role="button"
                                    onClick={() => obrisi(dogadjaj.sifra)}
                                ></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}                                  