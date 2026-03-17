import { useEffect, useState } from "react"
import DogadjajService from "../../services/dogadjaji/DogadjajService"
export default function DogadjajPregled() {


    const [dogadjaji, setDogadjaji] = useState([])

    useEffect(() => {
        ucitajDogadjaje()
    }, [])

    async function ucitajDogadjaje() {
        await DogadjajService.get().then((odgovor) => {
            setDogadjaji(odgovor.data)
        })

    }


    return (
        <>
            <ul>
                {dogadjaji && dogadjaji.map((dogadjaj) => (
                    <li>{dogadjaj.naziv}</li>
                ))
                }
            </ul>
        </>
    )
}