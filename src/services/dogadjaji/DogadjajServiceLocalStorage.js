import KartaService from "../karte/KartaService";
import RezervacijaService from "../rezervacije/RezervacijaService";

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
    return { success: true, data: [...dogadjaji] };
}

async function getBySifra(sifra) {
    const dogadjaji = dohvatiSveIzStorage();
    const dogadjaj = dogadjaji.find(s => s.sifra === parseInt(sifra));
    return { success: true, data: dogadjaj };
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
    await KartaService.generirajZaDogadjaj(dogadjaj);
    return { data: dogadjaj };
}

async function promjeni(sifra, dogadjaj) {
    const dogadjaji = dohvatiSveIzStorage();
    const index = dogadjaji.findIndex(s => s.sifra === parseInt(sifra));

    if (index === -1) {
        return { success: false, message: "Događaj ne postoji." };
    }

    // 1) Dohvati sve karte za događaj
    const sveKarte = (await KartaService.getByDogadjaj(parseInt(sifra))).data;

    // 2) Nađi sve rezervirane karte
    const rezervirane = sveKarte.filter(k => k.rezervirano);

    // 3) Ako postoje rezervirane karte → NE SMIJEŠ smanjiti broj mjesta ispod najveće rezervirane karte
    if (rezervirane.length > 0) {
        const maxRezervirana = Math.max(...rezervirane.map(k => k.broj));

        if (dogadjaj.brojMjesta < maxRezervirana) {
            return {
                success: false,
                message: `Ne možeš smanjiti broj mjesta na ${dogadjaj.brojMjesta} jer postoje rezervirane karte do broja ${maxRezervirana}.`
            };
        }
    }

    // 4) Ako NEMA rezervacija → smiješ regenerirati karte
    if (rezervirane.length === 0) {
        await KartaService.obrisiZaDogadjaj(parseInt(sifra));

        await KartaService.generirajZaDogadjaj({
            sifra: parseInt(sifra),
            brojMjesta: dogadjaj.brojMjesta
        });
    }

    // 5) Spremi promjene događaja
    dogadjaji[index] = { ...dogadjaji[index], ...dogadjaj };
    spremiUStorage(dogadjaji);

    return { success: true, data: dogadjaji[index] };
}


async function obrisi(sifra) {

    // obriši rezervacije tog događaja
    const rez = await RezervacijaService.get();
    for (let r of rez.data) {
        if (r.dogadjajSifra === parseInt(sifra)) {
            await RezervacijaService.obrisi(r.sifra);
        }
    }

    // obriši karte
    await KartaService.obrisiZaDogadjaj(parseInt(sifra));

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