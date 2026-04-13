import { DATA_SOURCE } from "../../constants";
import KartaServiceLocalStorage from "./KartaServiceLocalStorage";
import KartaServiceMemorija from "./KartaServiceMemorija";

let Servis = null;

switch (DATA_SOURCE) {
    case "memorija":
        Servis = KartaServiceMemorija;
        break;
    case "localstorage":
        Servis = KartaServiceLocalStorage;
        break;
    default:
        Servis = null;
}

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getByDogadjaj: async () => ({ success: false, data: [] }),
    generirajZaDogadjaj: async () => ({ success: false }),
    rezervirajKarte: async () => ({ success: false })
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getByDogadjaj: (sifra) => AktivniServis.getByDogadjaj(sifra),
    generirajZaDogadjaj: (dogadjaj) => AktivniServis.generirajZaDogadjaj(dogadjaj),
    rezervirajKarte: (dogadjajSifra, brojevi, rezervacijaSifra) => AktivniServis.rezervirajKarte(dogadjajSifra, brojevi, rezervacijaSifra),
    oslobodiKarte: (rezSifra) => AktivniServis.oslobodiKarte(rezSifra),
    obrisiZaDogadjaj: (sifra) => AktivniServis.obrisiZaDogadjaj(sifra),
};