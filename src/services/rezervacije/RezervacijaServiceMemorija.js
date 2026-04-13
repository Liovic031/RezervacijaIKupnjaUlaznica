import { rezervacije } from "./RezervacijaPodaci";
import KartaService from "../karte/KartaService";

// 1/4 Read
async function get() {
    return { success: true, data: [...rezervacije] };
}

async function getBySifra(sifra) {
    return { 
        success: true, 
        data: rezervacije.find(r => r.sifra === parseInt(sifra)) 
    };
}

// 2/4 Create
async function dodaj(rezervacija) {
    rezervacija.sifra = rezervacije.length > 0 
        ? rezervacije[rezervacije.length - 1].sifra + 1 
        : 1;

    rezervacije.push(rezervacija);

    return { data: rezervacija };
}

// 3/4 Update
async function promjeni(sifra, rezervacija) {
    const index = nadiIndex(sifra);
    rezervacije[index] = { ...rezervacije[index], ...rezervacija };
}

function nadiIndex(sifra) {
    return rezervacije.findIndex(r => r.sifra === parseInt(sifra));
}

// 4/4 Delete
async function obrisi(sifra) {
    await KartaService.oslobodiKarte(parseInt(sifra));

    const index = nadiIndex(sifra);
    rezervacije.splice(index, 1);
}
export default { get, getBySifra, dodaj, promjeni, obrisi };