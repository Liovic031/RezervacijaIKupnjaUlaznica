import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

import bcrypt from "bcryptjs";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";
import RezervacijaService from "../rezervacije/RezervacijaService";

const defaultSlika = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEsCAIAAAAJmGvpAAADD0lEQVR4nO3SQQ0AIRDAwOP8C1tZmKAhITMK+uiamQ9O+28H8CZjkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBYJY5EwFgljkTAWCWORMBaJDVgNBLAk8IkcAAAAAElFTkSuQmCC';

// GET ALL
async function get() {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KORISNICI);
        const snapshot = await getDocs(colRef);

        const data = snapshot.docs.map(d => ({
            sifra: d.id,
            ...d.data()
        }));

        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// GET BY SIFRA
async function getBySifra(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, sifra);
        const snap = await getDoc(docRef);

        if (!snap.exists()) return { success: false, data: null };

        return {
            success: true,
            data: { sifra: snap.id, ...snap.data() }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// GET BY EMAIL (za login)
async function getByEmail(email) {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KORISNICI);
        const q = query(colRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return { success: true, data: null };

        const d = snapshot.docs[0];
        return { success: true, data: { sifra: d.id, ...d.data() } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// CREATE
async function dodaj(korisnik) {
    try {
        if (korisnik.lozinka) {
            const salt = bcrypt.genSaltSync(10);
            korisnik.lozinkaHash = bcrypt.hashSync(korisnik.lozinka, salt);
            delete korisnik.lozinka;
        }

        korisnik.datumKreiranja = korisnik.datumKreiranja || new Date().toISOString();
        korisnik.uloga = korisnik.uloga || "korisnik";
        korisnik.slika = korisnik.slika || defaultSlika;

        const colRef = collection(getFirebaseDB(), PrefixStorage.KORISNICI);
        const docRef = await addDoc(colRef, korisnik);

        
        await updateDoc(docRef, { sifra: docRef.id });

        return { success: true, data: { sifra: docRef.id, ...korisnik } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}


// UPDATE
async function promjeni(sifra, korisnik) {
    try {
        if (korisnik.lozinka) {
            const salt = bcrypt.genSaltSync(10);
            korisnik.lozinkaHash = bcrypt.hashSync(korisnik.lozinka, salt);
            delete korisnik.lozinka;
        }

        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, sifra);
        await updateDoc(docRef, korisnik);

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// PROMJENA LOZINKE
async function promjeniLozinku(sifra, novaLozinka) {
    try {
        const hash = bcrypt.hashSync(novaLozinka, 10);

        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, sifra);
        await updateDoc(docRef, { lozinkaHash: hash });

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// DELETE
async function obrisi(sifra) {
    try {
        // obriši sve rezervacije korisnika
        const rez = await RezervacijaService.get();
        for (let r of rez.data) {
            if (String(r.korisnikSifra) === String(sifra)) {
                await RezervacijaService.obrisi(r.sifra);
            }
        }

        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, sifra);
        await deleteDoc(docRef);

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default {
    get,
    getBySifra,
    getByEmail,
    dodaj,
    promjeni,
    promjeniLozinku,
    obrisi
};
