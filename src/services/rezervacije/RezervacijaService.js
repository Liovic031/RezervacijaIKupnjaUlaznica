import { DATA_SOURCE } from "../../constants";
import RezervacijaServiceLocalStorage from "./RezervacijaServiceLocalStorage";
import RezervacijaServiceMemorija from "./RezervacijaServiceMemorija";

let Servis = null;

switch (DATA_SOURCE) {
    case "memorija":
        Servis = RezervacijaServiceMemorija;
        break;
    case "localstorage":
        Servis = RezervacijaServiceLocalStorage;
        break;
    default:
        Servis = null;
}

const PrazanServis = {
    get: async () => ({ success: false, data: [] }),
    getBySifra: async () => ({ success: false, data: {} }),
    dodaj: async () => console.error("Servis nije učitan"),
    promjeni: async () => console.error("Servis nije učitan"),
    obrisi: async () => console.error("Servis nije učitan"),
};

const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (rez) => AktivniServis.dodaj(rez),
    promjeni: (sifra, rez) => AktivniServis.promjeni(sifra, rez),
    obrisi: (sifra) => AktivniServis.obrisi(sifra),
};