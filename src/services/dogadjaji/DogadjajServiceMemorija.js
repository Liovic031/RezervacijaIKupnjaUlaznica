import { dogadjaji } from "./DogadjajPodaci";
import KartaService from "../karte/KartaService";
import RezervacijaService from "../rezervacije/RezervacijaService";

async function get() {
    return { success: true, data: [...dogadjaji] };
}

async function getBySifra(sifra) {
    return { success: true, data: dogadjaji.find(d => String(d.sifra) === String(sifra)) };
}

async function dodaj(dogadjaj) {
    dogadjaj.sifra =
        dogadjaji.length > 0
            ? String(Number(dogadjaji[dogadjaji.length - 1].sifra) + 1)
            : "1";

    dogadjaji.push(dogadjaj);

    await KartaService.generirajZaDogadjaj(dogadjaj);

    return { success: true, data: dogadjaj };
}

async function promjeni(sifra, dogadjaj) {
    const index = dogadjaji.findIndex(d => String(d.sifra) === String(sifra));

    if (index === -1) {
        return { success: false, message: "Događaj ne postoji." };
    }

    dogadjaji[index] = { ...dogadjaji[index], ...dogadjaj };

    return { success: true, data: dogadjaji[index] };
}

async function obrisi(sifra) {
    const rez = await RezervacijaService.get();
    for (let r of rez.data) {
        if (String(r.dogadjajSifra) === String(sifra)) {
            await RezervacijaService.obrisi(r.sifra);
        }
    }

    await KartaService.obrisiZaDogadjaj(String(sifra));

    const index = dogadjaji.findIndex(d => String(d.sifra) === String(sifra));
    if (index !== -1) dogadjaji.splice(index, 1);

    return { success: true, message: "Obrisano" };
}

export default { get, getBySifra, dodaj, promjeni, obrisi };
