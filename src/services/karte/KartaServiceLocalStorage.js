import { PrefixStorage } from "../../constants";

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(PrefixStorage.KARTE);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(PrefixStorage.KARTE, JSON.stringify(podaci));
}

async function get() {
    return { success: true, data: dohvatiSveIzStorage() };
}

async function getByDogadjaj(sifra) {
    return {
        success: true,
        data: dohvatiSveIzStorage().filter(
            k => String(k.dogadjajSifra) === String(sifra)
        )
    };
}

async function generirajZaDogadjaj(dogadjaj) {
    const sve = dohvatiSveIzStorage();

    const postojece = sve.filter(
        k => String(k.dogadjajSifra) === String(dogadjaj.sifra)
    );
    if (postojece.length > 0) return;

    const maxSifra = sve.length > 0
        ? Math.max(...sve.map(k => Number(k.sifra)))
        : 0;

    const nove = [];

    for (let i = 1; i <= dogadjaj.brojMjesta; i++) {
        nove.push({
            sifra: String(maxSifra + i),
            dogadjajSifra: String(dogadjaj.sifra),
            broj: i,
            rezervirano: false,
            rezervacijaSifra: null
        });
    }

    spremiUStorage([...sve, ...nove]);
}

async function rezervirajKarte(dogadjajSifra, brojevi, rezervacijaSifra) {
    const karte = dohvatiSveIzStorage();

    karte.forEach(k => {
        if (
            String(k.dogadjajSifra) === String(dogadjajSifra) &&
            brojevi.includes(k.broj)
        ) {
            k.rezervirano = true;
            k.rezervacijaSifra = String(rezervacijaSifra);
        }
    });

    spremiUStorage(karte);
    return { success: true };
}

async function oslobodiKarte(rezervacijaSifra) {
    const karte = dohvatiSveIzStorage();

    karte.forEach(k => {
        if (String(k.rezervacijaSifra) === String(rezervacijaSifra)) {
            k.rezervirano = false;
            k.rezervacijaSifra = null;
        }
    });

    spremiUStorage(karte);
    return { success: true };
}

async function obrisiZaDogadjaj(dogadjajSifra) {
    let karte = dohvatiSveIzStorage();

    karte = karte.filter(
        k => String(k.dogadjajSifra) !== String(dogadjajSifra)
    );

    spremiUStorage(karte);
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
