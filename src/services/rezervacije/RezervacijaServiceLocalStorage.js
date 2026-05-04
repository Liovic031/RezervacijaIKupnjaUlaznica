const STORAGE_KEY = "rezervacije";
import KartaService from "../karte/KartaService";

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    return { success: true, data: dohvatiSveIzStorage() };
}

async function getBySifra(sifra) {
    const rezervacije = dohvatiSveIzStorage();
    return {
        success: true,
        data: rezervacije.find(r => r.sifra === parseInt(sifra))
    };
}

async function dodaj(rezervacija) {
    const rezervacije = dohvatiSveIzStorage();

    rezervacija.sifra =
        rezervacije.length > 0
            ? Math.max(...rezervacije.map(r => r.sifra)) + 1
            : 1;

    rezervacija.evidentirano = false;
    rezervacija.datumEvidentiranja = null;

    rezervacije.push(rezervacija);
    spremiUStorage(rezervacije);

    return { success: true, data: rezervacija };
}

async function promjeni(sifra, rezervacija) {
    const rezervacije = dohvatiSveIzStorage();
    const index = rezervacije.findIndex(r => r.sifra === parseInt(sifra));

    if (index === -1) {
        return { success: false, message: "Rezervacija ne postoji." };
    }

    rezervacije[index] = { ...rezervacije[index], ...rezervacija };
    spremiUStorage(rezervacije);

    return { success: true, data: rezervacije[index] };
}

async function obrisi(sifra) {

    // 1) Oslobodi karte
    await KartaService.oslobodiKarte(sifra);

    // 2) Obriši rezervaciju
    let rezervacije = dohvatiSveIzStorage();
    rezervacije = rezervacije.filter(r => r.sifra !== parseInt(sifra));
    spremiUStorage(rezervacije);

    return { success: true, message: "Obrisano" };
}

export default {
    get,
    getBySifra,
    dodaj,
    promjeni,
    obrisi
};
