import { DATA_SOURCE } from "../../constants";
import DogadjajServiceLocalStorage from "./DogadjajServiceLocalStorage";
import DogadjajServiceMemorija from "./DogadjajServiceMemorija";

let Servis = null;

switch(DATA_SOURCE) {
    case 'memorija':
        Servis = DogadjajServiceMemorija;
        break;
    case 'localstorage':
        Servis = DogadjajServiceLocalStorage;
        break;
    default:
        Servis = null;
}

const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (dogadjaj) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, dogadjaj) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (smjer) => AktivniServis.dodaj(smjer),
    promjeni: (sifra, dogadjaj) => AktivniServis.promjeni(sifra, dogadjaj),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};