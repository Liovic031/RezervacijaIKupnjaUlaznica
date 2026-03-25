import { dogadjaji } from "./DogadjajPodaci";


// 1/4 Read od CRUD
async function get() {
    return {data: dogadjaji}
}

async function getBySifra(sifra) {
    return {data: dogadjaji.find(s => s.sifra === parseInt(sifra))}
}

// 2/4 Create of CRUD
async function dodaj(dogadjaj){
    dogadjaj.sifra = dogadjaji.length > 0 ? dogadjaj.sifra = dogadjaji[dogadjaji.length - 1].sifra + 1 : dogadjaj.sifra = 1;

    dogadjaji.push(dogadjaj);
}

// 3/4 Update of CRUD
async function promjeni(sifra, dogadjaj) {
    const index = nadiIndex(sifra)
    dogadjaji[index] = {...dogadjaji[index], ...dogadjaj}
}

function nadiIndex(sifra){
    return dogadjaji.findIndex(d => d.sifra === parseInt(sifra))
}

export default{ get, dodaj, getBySifra, promjeni }