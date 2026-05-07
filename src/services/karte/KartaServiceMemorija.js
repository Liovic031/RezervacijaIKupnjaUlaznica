import { karte } from "./KartaPodaci";

async function get() {
    return { success: true, data: [...karte] };
}

async function getByDogadjaj(sifra) {
    return {
        success: true,
        data: karte.filter(k => String(k.dogadjajSifra) === String(sifra))
    };
}

async function generirajZaDogadjaj(dogadjaj) {
    const postojece = karte.filter(
        k => String(k.dogadjajSifra) === String(dogadjaj.sifra)
    );
    if (postojece.length > 0) return;

    const maxSifra = karte.length > 0
        ? Math.max(...karte.map(k => Number(k.sifra)))
        : 0;

    for (let i = 1; i <= dogadjaj.brojMjesta; i++) {
        karte.push({
            sifra: String(maxSifra + i),
            dogadjajSifra: String(dogadjaj.sifra),
            broj: i,
            rezervirano: false,
            rezervacijaSifra: null
        });
    }

    return { success: true };
}

async function rezervirajKarte(dogadjajSifra, brojevi, rezervacijaSifra) {
    brojevi.forEach(broj => {
        const karta = karte.find(
            k =>
                String(k.dogadjajSifra) === String(dogadjajSifra) &&
                k.broj === broj
        );

        if (karta) {
            karta.rezervirano = true;
            karta.rezervacijaSifra = String(rezervacijaSifra);
        }
    });

    return { success: true };
}

async function oslobodiKarte(rezervacijaSifra) {
    karte.forEach(k => {
        if (String(k.rezervacijaSifra) === String(rezervacijaSifra)) {
            k.rezervirano = false;
            k.rezervacijaSifra = null;
        }
    });

    return { success: true };
}

async function obrisiZaDogadjaj(dogadjajSifra) {
    for (let i = karte.length - 1; i >= 0; i--) {
        if (String(karte[i].dogadjajSifra) === String(dogadjajSifra)) {
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
