import { z } from "zod";

export const ShemaPromjenaLozinke = z.object({
  novaLozinka: z.string()
    .min(8, "Lozinka mora imati barem 8 znakova")
    .regex(/[A-Z]/, "Mora sadržavati barem jedno veliko slovo")
    .regex(/[a-z]/, "Mora sadržavati barem jedno malo slovo")
    .regex(/[0-9]/, "Mora sadržavati barem jedan broj")
    .regex(/[^A-Za-z0-9]/, "Mora sadržavati barem jedan specijalni znak"),

  potvrdaLozinke: z.string()
}).refine(data => data.novaLozinka === data.potvrdaLozinke, {
  message: "Lozinke se ne podudaraju",
  path: ["potvrdaLozinke"]
});
