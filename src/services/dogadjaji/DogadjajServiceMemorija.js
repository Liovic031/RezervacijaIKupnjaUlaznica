import { dogadjaji } from "./DogadjajPodaci";
import KartaService from "../karte/KartaService";

// 1/4 Read od CRUD
async function get() {
    return {success: true, data: [...dogadjaji]} // kopija dogadjaja
}

async function getBySifra(sifra) {
    return {success: true, data: dogadjaji.find(d => d.sifra === parseInt(sifra))}
}

// 2/4 Create of CRUD
async function dodaj(dogadjaj){
    dogadjaj.sifra = dogadjaji.length > 0 ? dogadjaj.sifra = dogadjaji[dogadjaji.length - 1].sifra + 1 : dogadjaj.sifra = 1;
   
    dogadjaji.push(dogadjaj);
    await KartaService.generirajZaDogadjaj(dogadjaj);
}

// 3/4 Update of CRUD
async function promjeni(sifra, dogadjaj) {
    const index = nadiIndex(sifra)
    dogadjaji[index] = {...dogadjaji[index], ...dogadjaj}
}

function nadiIndex(sifra){
    return dogadjaji.findIndex(d => d.sifra === parseInt(sifra))
}

// 4/4 Delete of CRUD
async function obrisi(sifra) {

    // obriši rezervacije tog događaja
    const rez = await RezervacijaService.get();
    for (let r of rez.data) {
        if (r.dogadjajSifra === parseInt(sifra)) {
            await RezervacijaService.obrisi(r.sifra);
        }
    }

    // obriši karte
    await KartaService.obrisiZaDogadjaj(parseInt(sifra));

    let dogadjaji = dohvatiSveIzStorage();
    dogadjaji = dogadjaji.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(dogadjaji);

    return { message: 'Obrisano' };
}

export default{ get, dodaj, getBySifra, promjeni, obrisi }