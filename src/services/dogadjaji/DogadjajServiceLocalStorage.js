import { PrefixStorage } from "../../constants";
import KartaService from "../karte/KartaService";
import RezervacijaService from "../rezervacije/RezervacijaService";

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.DOGADJAJI);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.DOGADJAJI, JSON.stringify(podaci));
}

async function get() {
    return { success: true, data: dohvatiSveIzStorage() };
}

async function getBySifra(sifra) {
    const dogadjaji = dohvatiSveIzStorage();
    return {
        success: true,
        data: dogadjaji.find(s => s.sifra === parseInt(sifra))
    };
}

async function dodaj(dogadjaj) {
    const dogadjaji = dohvatiSveIzStorage();

    dogadjaj.sifra =
        dogadjaji.length > 0
            ? Math.max(...dogadjaji.map(s => s.sifra)) + 1
            : 1;

    dogadjaji.push(dogadjaj);
    spremiUStorage(dogadjaji);

    await KartaService.generirajZaDogadjaj(dogadjaj);

    return { success: true, data: dogadjaj };
}

async function promjeni(sifra, dogadjaj) {
    const dogadjaji = dohvatiSveIzStorage();
    const index = dogadjaji.findIndex(s => s.sifra === parseInt(sifra));

    if (index === -1) {
        return { success: false, message: "Događaj ne postoji." };
    }

    const sveKarte = (await KartaService.getByDogadjaj(parseInt(sifra))).data;
    const rezervirane = sveKarte.filter(k => k.rezervirano);

    if (rezervirane.length > 0) {
        const maxRez = Math.max(...rezervirane.map(k => k.broj));
        if (dogadjaj.brojMjesta < maxRez) {
            return {
                success: false,
                message: `Ne možeš smanjiti broj mjesta ispod ${maxRez}.`
            };
        }
    }

    if (rezervirane.length === 0) {
        await KartaService.obrisiZaDogadjaj(parseInt(sifra));
        await KartaService.generirajZaDogadjaj({
            sifra: parseInt(sifra),
            brojMjesta: dogadjaj.brojMjesta
        });
    }

    dogadjaji[index] = { ...dogadjaji[index], ...dogadjaj };
    spremiUStorage(dogadjaji);

    return { success: true, data: dogadjaji[index] };
}

async function obrisi(sifra) {
    const rez = await RezervacijaService.get();
    for (let r of rez.data) {
        if (r.dogadjajSifra === parseInt(sifra)) {
            await RezervacijaService.obrisi(r.sifra);
        }
    }

    await KartaService.obrisiZaDogadjaj(parseInt(sifra));

    let dogadjaji = dohvatiSveIzStorage();
    dogadjaji = dogadjaji.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(dogadjaji);

    return { success: true, message: "Obrisano" };
}

export default { get, getBySifra, dodaj, promjeni, obrisi };
