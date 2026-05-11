import { DATA_SOURCE } from "../../constants";
import KorisnikServiceFireBase from "./KorisnikServiceFireBase";
import KorisnikServiceLocalStorage from "./KorisnikServiceLocalStorage";
import KorisnikServiceMemorija from "./KorisnikServiceMemorija";

let Servis = null;

switch (DATA_SOURCE) {
    case 'memorija':
        Servis = KorisnikServiceMemorija;
        break;
    case 'firebase':
        Servis = KorisnikServiceFireBase;
        break;
    case 'localstorage':
        Servis = KorisnikServiceLocalStorage;
        break;
    default:
        Servis = null;
}

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getBySifra: async (sifra) => ({ success: false, data: null }),
    getByEmail: async (email) => ({ success: false, data: null }),
    dodaj: async (korisnik) => ({ success: false, message: "Servis nije učitan" }),
    promjeni: async (sifra, korisnik) => ({ success: false, message: "Servis nije učitan" }),
    obrisi: async (sifra) => ({ success: false, message: "Servis nije učitan" }),
    oslobodiKarte: async (rezSifra) => ({ success: false }),
    obrisiZaDogadjaj: async (sifra) => ({ success: false })
};

// Jedan jedini export
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    getByEmail: (email) => AktivniServis.getByEmail(email),
    dodaj: (korisnik) => AktivniServis.dodaj(korisnik),
    promjeni: (sifra, korisnik) => AktivniServis.promjeni(sifra, korisnik),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
    oslobodiKarte: (rezSifra) => AktivniServis.oslobodiKarte(rezSifra),
    obrisiZaDogadjaj: (sifra) => AktivniServis.obrisiZaDogadjaj(sifra),
    promjeniLozinku: (sifra, novaLozinka) => AktivniServis.promjeniLozinku(sifra, novaLozinka)
};
