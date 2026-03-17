import { useEffect, useState } from "react"
import DogadjajService from "../../services/dogadjaji/DogadjajService"

export default function DogadjajPregled() {


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
            <ul>
                {dogadjaji && dogadjaji.map((dogadjaj) => (
                    <li key={dogadjaj.sifra}>{dogadjaj.naziv}</li>
                ))
                }
            </ul>
        </>
    )
}