import { karte } from "./KartaPodaci";

async function get() {
    return { success: true, data: [...karte] };
}

async function getByDogadjaj(sifra) {
    return {
        success: true,
        data: karte.filter(k => k.dogadjajSifra === parseInt(sifra))
    };
}

async function generirajZaDogadjaj(dogadjaj) {
    const postojece = karte.filter(k => k.dogadjajSifra === dogadjaj.sifra);
    if (postojece.length > 0) return;

    const maxSifra = karte.length > 0 ? Math.max(...karte.map(k => k.sifra)) : 0;

    for (let i = 1; i <= dogadjaj.brojMjesta; i++) {
        karte.push({
            sifra: maxSifra + i,
            dogadjajSifra: dogadjaj.sifra,
            broj: i,
            rezervirano: false,
            rezervacijaSifra: null
        });
    }

    return { success: true };
}

async function rezervirajKarte(dogadjajSifra, brojevi, rezervacijaSifra) {
    brojevi.forEach(broj => {
        const karta = karte.find(k =>
            k.dogadjajSifra === dogadjajSifra &&
            k.broj === broj
        );

        if (karta) {
            karta.rezervirano = true;
            karta.rezervacijaSifra = rezervacijaSifra;
        }
    });

    return { success: true };
}

async function oslobodiKarte(rezervacijaSifra) {
    karte.forEach(k => {
        if (k.rezervacijaSifra === parseInt(rezervacijaSifra)) {
            k.rezervirano = false;
            k.rezervacijaSifra = null;
        }
    });

    return { success: true };
}

async function obrisiZaDogadjaj(dogadjajSifra) {
    for (let i = karte.length - 1; i >= 0; i--) {
        if (karte[i].dogadjajSifra === parseInt(dogadjajSifra)) {
            karte.splice(i, 1);
        }
    }

    return { success: true };
}

export default {
    get,
    getByDogadjaj,
    generirajZaDogadjaj,
    rezervirajKarte,
    oslobodiKarte,
    obrisiZaDogadjaj
};
