import { useEffect, useState } from "react"
import DogadjajService from "../../services/dogadjaji/DogadjajService"
import { Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import FormatDatuma from "../../components/ForamtDatuma"

export default function DogadjajPregled() {

    //dohvaćanje podataka
    const [dogadjaji, setDogadjaji] = useState([])
    async function ucitajDogadjaje() {
        const odgovor = await DogadjajService.get()
        setDogadjaji(odgovor.data)

    }
    useEffect(() => {
        ucitajDogadjaje()
    }, [])



    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Lokacija</th>
                        <th>Datum</th>
                        <th>Slobodna mjesta</th>
                        <th>Ukupno mjesta</th>
                        <th>Cijena</th>
                        <th>Aktivan</th>
                    </tr>
                </thead>
                <tbody>
                    {dogadjaji && dogadjaji.map((dogadjaj)=>(
                        <tr>
                            <td>{dogadjaj.naziv}</td>
                            <td>{dogadjaj.lokacija}</td>
                            <td><FormatDatuma datum={dogadjaj.datumOdrzavanja} /></td>
                            <td>{dogadjaj.dostupnoMjesta}</td>
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
                            <td>{dogadjaj.aktivan ? 'Da' : 'Ne'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}