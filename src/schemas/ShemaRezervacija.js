import { z } from "zod";

export const ShemaRezervacija = z.object({
  korisnikSifra: z.coerce.number({
    invalid_type_error: "Morate odabrati korisnika!"
  }).positive("Morate odabrati korisnika!"),

  dogadjajSifra: z.coerce.number({
    invalid_type_error: "Morate odabrati događaj!"
  }).positive("Morate odabrati događaj!")
});
