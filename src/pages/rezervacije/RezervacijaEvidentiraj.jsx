import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";

export default function RezervacijaEvidentiraj() {

    const { sifra } = useParams();
    const [status, setStatus] = useState("Učitavanje...");

    useEffect(() => {
        async function evidentiraj() {
            const odgovor = await RezervacijaService.getBySifra(sifra);

            if (!odgovor.data) {
                setStatus("Rezervacija ne postoji.");
                return;
            }

            if (odgovor.data.evidentirano) {
                setStatus("Ulaz je već evidentiran ranije.");
                return;
            }

            await RezervacijaService.promjeni(sifra, {
                evidentirano: true,
                datumEvidentiranja: new Date().toISOString()
            });

            setStatus("Ulaz uspješno evidentiran!");
        }

        evidentiraj();
    }, [sifra]);

    return (
        <div style={{ padding: 20 }}>
            <h2>{status}</h2>
        </div>
    );
}
