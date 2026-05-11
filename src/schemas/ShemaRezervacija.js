import { z } from "zod";

export const ShemaRezervacija = z.object({
  korisnikSifra: z.string().min(1, "Morate odabrati korisnika!"),
  dogadjajSifra: z.string().min(1, "Morate odabrati događaj!")
});

