import { z } from "zod";

export const ShemaDogadjaj = z.object({
  naziv: z.string()
    .trim()
    .min(1, "Naziv je obavezan!")
    .min(3, "Naziv mora imati najmanje 3 znaka!")
    .max(100, "Naziv može imati najviše 100 znakova!"),

  lokacija: z.string()
    .trim()
    .max(100, "Lokacija može imati najviše 100 znakova!"),

  datumOdrzavanja: z.coerce.date({
    required_error: "Datum održavanja je obavezan!",
    invalid_type_error: "Unesite ispravan datum!"
  }).refine((d) => {
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);
    return d >= danas;
  }, "Datum održavanja ne može biti u prošlosti!"),

  brojMjesta: z.coerce.number({
    invalid_type_error: "Broj mjesta mora biti broj!"
  })
    .min(1, "Broj mjesta mora biti veći od 0!")
    .max(100000, "Broj mjesta je prevelik!"),

  cijena: z.coerce.number({
    invalid_type_error: "Cijena mora biti broj!"
  })
    .min(0, "Cijena mora biti 0 ili više!"),

  aktivan: z.boolean()
});
