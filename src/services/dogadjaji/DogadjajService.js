import { dogadjaji } from "./DogadjajPodaci";


// 1/4 Read od CRUD
async function get() {
    return {data: dogadjaji}
}

// 2/4 Create of CRUD
async function dodaj(dogadjaj){
    dogadjaj.sifra = dogadjaji.length > 0 ? dogadjaj.sifra = dogadjaji[dogadjaji.length - 1].sifra + 1 : dogadjaj.sifra = 1;

    dogadjaji.push(dogadjaj);
}

export default{ get, dodaj }