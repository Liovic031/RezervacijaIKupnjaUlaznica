import { DATA_SOURCE } from "../../constants";
import KartaServiceLocalStorage from "./KartaServiceLocalStorage";
import KartaServiceMemorija from "./KartaServiceMemorija";

let AktivniServis = null;

switch (DATA_SOURCE) {
    case "memorija":
        AktivniServis = KartaServiceMemorija;
        break;

    case "localstorage":
        AktivniServis = KartaServiceLocalStorage;
        break;

    default:
        AktivniServis = KartaServiceLocalStorage;
        break;
}

export default {
    get: () => AktivniServis.get(),
    getByDogadjaj: (sifra) => AktivniServis.getByDogadjaj(sifra),
    generirajZaDogadjaj: (dogadjaj) => AktivniServis.generirajZaDogadjaj(dogadjaj),
    rezervirajKarte: (dogadjajSifra, brojevi, rezervacijaSifra) =>
        AktivniServis.rezervirajKarte(dogadjajSifra, brojevi, rezervacijaSifra),
    oslobodiKarte: (rezSifra) => AktivniServis.oslobodiKarte(rezSifra),
    obrisiZaDogadjaj: (sifra) => AktivniServis.obrisiZaDogadjaj(sifra),
};
