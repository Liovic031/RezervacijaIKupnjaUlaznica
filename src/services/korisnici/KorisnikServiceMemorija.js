// src/services/korisnici/KorisnikServiceMemorija.js
import { korisnici } from "./KorisnikPodaci";
import RezervacijaService from "../rezervacije/RezervacijaService";
import bcrypt from "bcryptjs";

async function get() {
  return { success: true, data: [...korisnici] };
}

async function getBySifra(sifra) {
  return { success: true, data: korisnici.find(k => k.sifra === parseInt(sifra)) || null };
}

async function getByEmail(email) {
  const o = korisnici.find(k => k.email === email);
  return { success: true, data: o || null };
}

async function dodaj(korisnik) {
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

  korisnici.push(korisnik);
  return { success: true, data: korisnik };
}

async function promjeni(sifra, korisnik) {
  const index = korisnici.findIndex(k => k.sifra === parseInt(sifra));
  if (index === -1) return { success: false, message: "Korisnik ne postoji." };

  if (korisnik.lozinka) {
    const salt = bcrypt.genSaltSync(10);
    korisnik.lozinkaHash = bcrypt.hashSync(korisnik.lozinka, salt);
    delete korisnik.lozinka;
  }

  korisnici[index] = { ...korisnici[index], ...korisnik };
  return { success: true, data: korisnici[index] };
}

async function obrisi(sifra) {
  const rez = await RezervacijaService.get();
  for (let r of rez.data) {
    if (r.korisnikSifra === parseInt(sifra)) {
      await RezervacijaService.obrisi(r.sifra);
    }
  }

  const index = korisnici.findIndex(k => k.sifra === parseInt(sifra));
  if (index !== -1) korisnici.splice(index, 1);
  return { success: true };
}

export default { get, dodaj, getBySifra, getByEmail, promjeni, obrisi };
