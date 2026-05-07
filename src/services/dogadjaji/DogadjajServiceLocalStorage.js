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
        data: dogadjaji.find(s => String(s.sifra) === String(sifra))
    };
}

async function dodaj(dogadjaj) {
    const dogadjaji = dohvatiSveIzStorage();

    dogadjaj.sifra =
        dogadjaji.length > 0
            ? String(Math.max(...dogadjaji.map(s => Number(s.sifra))) + 1)
            : "1";

    dogadjaji.push(dogadjaj);
    spremiUStorage(dogadjaji);

    await KartaService.generirajZaDogadjaj(dogadjaj);

    return { success: true, data: dogadjaj };
}

async function promjeni(sifra, dogadjaj) {
    const dogadjaji = dohvatiSveIzStorage();
    const index = dogadjaji.findIndex(s => String(s.sifra) === String(sifra));

    if (index === -1) {
        return { success: false, message: "Događaj ne postoji." };
    }

    const sveKarte = (await KartaService.getByDogadjaj(String(sifra))).data;
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
        await KartaService.obrisiZaDogadjaj(String(sifra));
        await KartaService.generirajZaDogadjaj({
            sifra: String(sifra),
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
        if (String(r.dogadjajSifra) === String(sifra)) {
            await RezervacijaService.obrisi(r.sifra);
        }
    }

    await KartaService.obrisiZaDogadjaj(String(sifra));

    let dogadjaji = dohvatiSveIzStorage();
    dogadjaji = dogadjaji.filter(s => String(s.sifra) !== String(sifra));
    spremiUStorage(dogadjaji);

    return { success: true, message: "Obrisano" };
}

export default { get, getBySifra, dodaj, promjeni, obrisi };
