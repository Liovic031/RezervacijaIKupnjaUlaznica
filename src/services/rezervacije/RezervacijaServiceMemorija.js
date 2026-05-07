import { rezervacije } from "./RezervacijaPodaci";
import KartaService from "../karte/KartaService";

// READ
async function get() {
    return { success: true, data: [...rezervacije] };
}

async function getBySifra(sifra) {
    return {
        success: true,
        data: rezervacije.find(r => String(r.sifra) === String(sifra))
    };
}

// CREATE
async function dodaj(rezervacija) {
    rezervacija.sifra =
        rezervacije.length > 0
            ? String(Math.max(...rezervacije.map(r => Number(r.sifra))) + 1)
            : "1";

    rezervacija.evidentirano = false;
    rezervacija.datumEvidentiranja = null;

    rezervacije.push(rezervacija);

    return { success: true, data: rezervacija };
}

// UPDATE
async function promjeni(sifra, rezervacija) {
    const index = rezervacije.findIndex(r => String(r.sifra) === String(sifra));

    if (index === -1) {
        return { success: false, message: "Rezervacija ne postoji." };
    }

    rezervacije[index] = { ...rezervacije[index], ...rezervacija };

    return { success: true, data: rezervacije[index] };
}

// DELETE
async function obrisi(sifra) {

    // 1) Oslobodi karte
    await KartaService.oslobodiKarte(sifra);

    // 2) Obriši rezervaciju
    const index = rezervacije.findIndex(r => String(r.sifra) === String(sifra));
    if (index !== -1) rezervacije.splice(index, 1);

    return { success: true, message: "Obrisano" };
}

export default { get, getBySifra, dodaj, promjeni, obrisi };
