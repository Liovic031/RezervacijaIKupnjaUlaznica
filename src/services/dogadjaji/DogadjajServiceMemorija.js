import { dogadjaji } from "./DogadjajPodaci";
import KartaService from "../karte/KartaService";
import RezervacijaService from "../rezervacije/RezervacijaService";

// READ
async function get() {
    return { success: true, data: [...dogadjaji] };
}

async function getBySifra(sifra) {
    return { success: true, data: dogadjaji.find(d => d.sifra === parseInt(sifra)) };
}

// CREATE
async function dodaj(dogadjaj) {
    dogadjaj.sifra =
        dogadjaji.length > 0
            ? dogadjaji[dogadjaji.length - 1].sifra + 1
            : 1;

    dogadjaji.push(dogadjaj);

    await KartaService.generirajZaDogadjaj(dogadjaj);

    return { success: true, data: dogadjaj };
}

// UPDATE
async function promjeni(sifra, dogadjaj) {
    const index = dogadjaji.findIndex(d => d.sifra === parseInt(sifra));

    if (index === -1) {
        return { success: false, message: "Događaj ne postoji." };
    }

    dogadjaji[index] = { ...dogadjaji[index], ...dogadjaj };

    return { success: true, data: dogadjaji[index] };
}

// DELETE
async function obrisi(sifra) {

    // obriši rezervacije
    const rez = await RezervacijaService.get();
    for (let r of rez.data) {
        if (r.dogadjajSifra === parseInt(sifra)) {
            await RezervacijaService.obrisi(r.sifra);
        }
    }

    // obriši karte
    await KartaService.obrisiZaDogadjaj(parseInt(sifra));

    // obriši događaj iz memorije
    const index = dogadjaji.findIndex(d => d.sifra === parseInt(sifra));
    if (index !== -1) dogadjaji.splice(index, 1);

    return { success: true, message: "Obrisano" };
}

export default { get, getBySifra, dodaj, promjeni, obrisi };
