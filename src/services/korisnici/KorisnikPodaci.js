// src/services/korisnici/KorisnikPodaci.js
import bcrypt from "bcryptjs";

// Lozinka za admina: "Edunova123!"
const hashiranaLozinka = bcrypt.hashSync("Edunova123!", 10);

export const korisnici = [
  {
    sifra: 1,
    ime: "Admin",
    prezime: "Edunova",
    email: "admin@edunova.hr",
    datumKreiranja: new Date().toISOString(),
    lozinkaHash: hashiranaLozinka,
    uloga: "admin"
  },
  {
    sifra: 2,
    ime: "Marko",
    prezime: "Horvat",
    email: "marko.horvat@example.com",
    datumKreiranja: "2026-01-15T12:00:00",
    lozinkaHash: null,
    uloga: "korisnik"
  },
  {
    sifra: 3,
    ime: "Ana",
    prezime: "Kovačić",
    email: "ana.kovacic@example.com",
    datumKreiranja: "2026-02-10T09:30:00",
    lozinkaHash: null,
    uloga: "korisnik"
  },
  {
    sifra: 4,
    ime: "Gaj",
    prezime: "BalogŠandor",
    email: "gaj@example.com",
    datumKreiranja: "2026-03-01T10:00:00",
    lozinkaHash: null,
    uloga: "korisnik"
  },
  {
    sifra: 5,
    ime: "Lana",
    prezime: "Marić",
    email: "lana@example.com",
    datumKreiranja: "2026-03-05T11:00:00",
    lozinkaHash: null,
    uloga: "korisnik"
  },
  {
    sifra: 6,
    ime: "Ivan",
    prezime: "Novak",
    email: "ivan@example.com",
    datumKreiranja: "2026-03-10T12:00:00",
    lozinkaHash: null,
    uloga: "korisnik"
  }
];
