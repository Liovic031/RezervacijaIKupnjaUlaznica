import { korisnici } from "./KorisnikPodaci";

// 1/4 Read
async function get() {
    return { success: true, data: [...korisnici] };
}

async function getBySifra(sifra) {
    return { success: true, data: korisnici.find(k => k.sifra === parseInt(sifra)) };
}

// 2/4 Create
async function dodaj(korisnik) {
    korisnik.sifra = korisnici.length > 0 
        ? korisnici[korisnici.length - 1].sifra + 1 
        : 1;

    korisnici.push(korisnik);
}

// 3/4 Update
async function promjeni(sifra, korisnik) {
    const index = nadiIndex(sifra);
    korisnici[index] = { ...korisnici[index], ...korisnik };
}

function nadiIndex(sifra) {
    return korisnici.findIndex(k => k.sifra === parseInt(sifra));
}

// 4/4 Delete
async function obrisi(sifra) {
    const index = nadiIndex(sifra);
    korisnici.splice(index, 1);
}

export default { get, dodaj, getBySifra, promjeni, obrisi };