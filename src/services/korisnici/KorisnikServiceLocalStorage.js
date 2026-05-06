import { PrefixStorage } from "../../constants";
import bcrypt from "bcryptjs";
import RezervacijaService from "../rezervacije/RezervacijaService";

const defaultSlika = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEsCAIAAAAJmGvpAAADD0lEQVR4nO3SQQ0AIRDAwOP8C1tZmKAhITMK+uiamQ9O+28H8CZjkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBaJDVgNBLAk8IkcAAAAAElFTkSuQmCC';

function dohvatiSveIzStorage() {
  const podaci = localStorage.getItem(PrefixStorage.KORISNICI);
  return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
  localStorage.setItem(PrefixStorage.KORISNICI, JSON.stringify(podaci));
}

async function get() {
  return { success: true, data: dohvatiSveIzStorage() };
}

async function getBySifra(sifra) {
  const korisnici = dohvatiSveIzStorage();
  return { success: true, data: korisnici.find(k => k.sifra === parseInt(sifra)) || null };
}

async function getByEmail(email) {
  const korisnici = dohvatiSveIzStorage();
  const found = korisnici.find(k => k.email === email);
  return { success: true, data: found || null };
}

async function dodaj(korisnik) {
  const korisnici = dohvatiSveIzStorage();

  korisnik.sifra = korisnici.length > 0 ? Math.max(...korisnici.map(k => k.sifra)) + 1 : 1;

  if (korisnik.lozinka) {
    const salt = bcrypt.genSaltSync(10);
    korisnik.lozinkaHash = bcrypt.hashSync(korisnik.lozinka, salt);
    delete korisnik.lozinka;
  } else {
    korisnik.lozinkaHash = korisnik.lozinkaHash || null;
  }

  korisnik.datumKreiranja = korisnik.datumKreiranja || new Date().toISOString();
  korisnik.uloga = korisnik.uloga || "korisnik";

  korisnik.slika = korisnik.slika || defaultSlika;


  korisnici.push(korisnik);
  spremiUStorage(korisnici);

  return { success: true, data: korisnik };
}

async function promjeni(sifra, korisnik) {
  const korisnici = dohvatiSveIzStorage();
  const index = korisnici.findIndex(k => k.sifra === parseInt(sifra));

  if (index === -1) return { success: false, message: "Korisnik ne postoji." };

  if (korisnik.lozinka) {
    const salt = bcrypt.genSaltSync(10);
    korisnik.lozinkaHash = bcrypt.hashSync(korisnik.lozinka, salt);
    delete korisnik.lozinka;
  }

  korisnici[index] = { ...korisnici[index], ...korisnik };
  spremiUStorage(korisnici);

  return { success: true, data: korisnici[index] };
}
// promjena lozinke
function getKorisnici() {
    return JSON.parse(localStorage.getItem("korisnici")) || [];
}
function spremiKorisnike(korisnici) {
    localStorage.setItem("korisnici", JSON.stringify(korisnici));
}
async function promjeniLozinku(sifra, novaLozinka) {
    const korisnici = getKorisnici();
    const index = korisnici.findIndex(k => k.sifra == sifra);

    if (index === -1) {
        return { success: false, message: "Korisnik nije pronađen" };
    }

    korisnici[index].lozinkaHash = bcrypt.hashSync(novaLozinka, 10);
    spremiKorisnike(korisnici);

    return { success: true };
}



async function obrisi(sifra) {
  const rez = await RezervacijaService.get();
  for (let r of rez.data) {
    if (r.korisnikSifra === parseInt(sifra)) {
      await RezervacijaService.obrisi(r.sifra);
    }
  }

  let korisnici = dohvatiSveIzStorage();
  korisnici = korisnici.filter(k => k.sifra !== parseInt(sifra));
  spremiUStorage(korisnici);

  return { success: true, message: "Obrisano" };
}

export default { get, getBySifra, getByEmail, dodaj, promjeni, obrisi, promjeniLozinku };
