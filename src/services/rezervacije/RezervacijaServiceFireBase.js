import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";
import KartaService from "../karte/KartaService";

// GET ALL
async function get() {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.REZERVACIJE);
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
        const docRef = doc(getFirebaseDB(), PrefixStorage.REZERVACIJE, sifra);
        const snap = await getDoc(docRef);

        if (!snap.exists()) return { success: false, data: null };

        return { success: true, data: { sifra: snap.id, ...snap.data() } };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// CREATE
async function dodaj(rezervacija) {
    try {
        rezervacija.evidentirano = false;
        rezervacija.datumEvidentiranja = null;

        const colRef = collection(getFirebaseDB(), PrefixStorage.REZERVACIJE);
        const docRef = await addDoc(colRef, rezervacija);

        // 🔥 KLJUČNO — SPREMI SIFRA U DOKUMENT
        await updateDoc(docRef, { sifra: docRef.id });

        return { 
            success: true, 
            data: { sifra: docRef.id, ...rezervacija }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}


// UPDATE
async function promjeni(sifra, rezervacija) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.REZERVACIJE, sifra);
        await updateDoc(docRef, rezervacija);

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// DELETE
async function obrisi(sifra) {
    try {
        // 1) oslobodi karte
        await KartaService.oslobodiKarte(sifra);

        // 2) obriši rezervaciju
        const docRef = doc(getFirebaseDB(), PrefixStorage.REZERVACIJE, sifra);
        await deleteDoc(docRef);

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default {
    get,
    getBySifra,
    dodaj,
    promjeni,
    obrisi
};
