import { useEffect, useState } from "react"
import DogadjajService from "../../services/dogadjaji/DogadjajService"
import { Button, Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import FormatDatuma from "../../components/ForamtDatuma"
import { GrClose, GrValidate } from "react-icons/gr"
import { RouteNames } from "../../constants"
import { Link, useNavigate } from "react-router-dom"

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
            <Link to={RouteNames.DOGADJAJI_NOVI} className="btn btn-success w-100 my-3">
                Dodavanje novog događaja
            </Link>

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
                                <Button onClick={() => { navigate(`/dogadjaji/${dogadjaj.sifra}`) }}>Promjena</Button>
                                &nbsp;&nbsp;
                                <Button variant="danger" onClick={() => { obrisi(dogadjaj.sifra) }}>Obriši</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}