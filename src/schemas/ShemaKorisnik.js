import { z } from "zod";

export const ShemaKorisnik = z.object({
  ime: z.string()
    .trim()
    .min(1, "Ime je obavezno!")
    .min(2, "Ime mora imati najmanje 2 znaka!")
    .max(30, "Ime može imati najviše 30 znakova!"),

  prezime: z.string()
    .trim()
    .min(1, "Prezime je obavezno!")
    .min(2, "Prezime mora imati najmanje 2 znaka!")
    .max(30, "Prezime može imati najviše 30 znakova!"),

  email: z.string()
    .trim()
    .min(1, "Email je obavezan!")
    .email("Email nije u ispravnom formatu!")
});
