import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import KorisnikService from "../services/korisnici/KorisnikService";
import { PrefixStorage, RouteNames } from "../constants";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const s = localStorage.getItem(PrefixStorage.AUTH_USER);
      if (s) {
        setAuthUser(JSON.parse(s));
        setIsLoggedIn(true);
      } else {
        setAuthUser(null);
        setIsLoggedIn(false);
      }
    } catch (e) {
      setAuthUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  async function login(email, lozinka) {
    const res = await KorisnikService.getByEmail(email);
    if (!res.success || !res.data) {
      return { success: false, message: "Email i lozinka ne odgovaraju" };
    }

    const korisnik = res.data;
    if (!korisnik.lozinkaHash) {
      return { success: false, message: "Korisnik nema postavljenu lozinku" };
    }

    const ok = bcrypt.compareSync(lozinka, korisnik.lozinkaHash);
    if (!ok) return { success: false, message: "Email i lozinka ne odgovaraju" };

    const userForStore = { sifra: korisnik.sifra, email: korisnik.email, uloga: korisnik.uloga };
    localStorage.setItem(PrefixStorage.AUTH_USER, JSON.stringify(userForStore));
    setAuthUser(userForStore);
    setIsLoggedIn(true);
    // navigate na nadzornu ploču ako postoji ruta
    if (RouteNames && RouteNames.NADZORNA_PLOCA) navigate(RouteNames.NADZORNA_PLOCA);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem(PrefixStorage.AUTH_USER);
    setAuthUser(null);
    setIsLoggedIn(false);
    if (RouteNames && RouteNames.HOME) navigate(RouteNames.HOME);
    else navigate("/");
  }

  async function registracija({ ime, prezime, email, lozinka }) {
    const postoji = await KorisnikService.getByEmail(email);
    if (postoji.success && postoji.data) return { success: false, message: "Email već postoji" };

    const res = await KorisnikService.dodaj({
      ime,
      prezime,
      email,
      lozinka,
      uloga: "korisnik",
      datumKreiranja: new Date().toISOString()
    });

    if (res.success) return { success: true };
    return { success: false, message: "Greška pri registraciji" };
  }

  const value = { isLoggedIn, authUser, login, logout, registracija };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
