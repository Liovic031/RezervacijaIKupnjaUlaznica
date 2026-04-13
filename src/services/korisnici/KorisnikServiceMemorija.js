import { korisnici } from "./KorisnikPodaci";
import RezervacijaService from "../rezervacije/RezervacijaService";

// READ
async function get() {
    return { success: true, data: [...korisnici] };
}

async function getBySifra(sifra) {
    return { success: true, data: korisnici.find(k => k.sifra === parseInt(sifra)) };
}

// CREATE
async function dodaj(korisnik) {
    korisnik.sifra =
        korisnici.length > 0
            ? korisnici[korisnici.length - 1].sifra + 1
            : 1;

    korisnici.push(korisnik);
}

// UPDATE
async function promjeni(sifra, korisnik) {
    const index = korisnici.findIndex(k => k.sifra === parseInt(sifra));
    korisnici[index] = { ...korisnici[index], ...korisnik };
}

async function obrisi(sifra) {

    const rez = await RezervacijaService.get();

    for (let r of rez.data) {
        if (r.korisnikSifra === parseInt(sifra)) {
            await RezervacijaService.obrisi(r.sifra);
        }
    }

    const index = korisnici.findIndex(k => k.sifra === parseInt(sifra));
    korisnici.splice(index, 1);
}

export default { get, dodaj, getBySifra, promjeni, obrisi };