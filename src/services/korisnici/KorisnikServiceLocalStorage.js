const STORAGE_KEY = 'korisnici';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const korisnici = dohvatiSveIzStorage();
    return { success: true, data: [...korisnici] };
}

async function getBySifra(sifra) {
    const korisnici = dohvatiSveIzStorage();
    const korisnik = korisnici.find(s => s.sifra === parseInt(sifra));
    return { success: true, data: korisnik };
}

async function dodaj(korisnik) {
    const korisnici = dohvatiSveIzStorage();

    if (korisnici.length === 0) {
        korisnik.sifra = 1;
    } else {
        const maxSifra = Math.max(...korisnici.map(s => s.sifra));
        korisnik.sifra = maxSifra + 1;
    }

    korisnici.push(korisnik);
    spremiUStorage(korisnici);
    return { data: korisnik };
}

async function promjeni(sifra, korisnik) {
    const korisnici = dohvatiSveIzStorage();
    const index = korisnici.findIndex(s => s.sifra === parseInt(sifra));

    if (index !== -1) {
        korisnici[index] = { ...korisnici[index], ...korisnik };
        spremiUStorage(korisnici);
    }
    return { data: korisnici[index] };
}

async function obrisi(sifra) {
    let korisnici = dohvatiSveIzStorage();
    korisnici = korisnici.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(korisnici);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};