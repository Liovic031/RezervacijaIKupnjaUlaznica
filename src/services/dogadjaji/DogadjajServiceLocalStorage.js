const STORAGE_KEY = 'dogadjaji';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const dogadjaji = dohvatiSveIzStorage();
    return {success: true,  data: [...dogadjaji] };
}

async function getBySifra(sifra) {
    const dogadjaji = dohvatiSveIzStorage();
    const dogadjaj = dogadjaji.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: dogadjaj };
}

async function dodaj(dogadjaj) {
    const dogadjaji = dohvatiSveIzStorage();
    
    if (dogadjaji.length === 0) {
        dogadjaj.sifra = 1;
    } else {
        const maxSifra = Math.max(...dogadjaji.map(s => s.sifra));
        dogadjaj.sifra = maxSifra + 1;
    }
    
    dogadjaji.push(dogadjaj);
    spremiUStorage(dogadjaji);
    return { data: dogadjaj };
}

async function promjeni(sifra, dogadjaj) {
    const dogadjaji = dohvatiSveIzStorage();
    const index = dogadjaji.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        dogadjaji[index] = { ...dogadjaji[index], ...dogadjaj};
        spremiUStorage(dogadjaji);
    }
    return { data: dogadjaji[index] };
}

async function obrisi(sifra) {
    let dogadjaji = dohvatiSveIzStorage();
    dogadjaji = dogadjaji.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(dogadjaji);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};