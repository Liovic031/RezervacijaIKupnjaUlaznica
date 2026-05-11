import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

// GET ALL
async function get() {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KARTE);
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

// GET BY DOGADJAJ
async function getByDogadjaj(sifra) {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KARTE);
        const q = query(colRef, where("dogadjajSifra", "==", String(sifra)));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(d => ({
            sifra: d.id,
            ...d.data()
        }));

        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// GENERIRAJ KARTE
async function generirajZaDogadjaj(dogadjaj) {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KARTE);

        // Provjeri postoje li već karte
        const q = query(colRef, where("dogadjajSifra", "==", String(dogadjaj.sifra)));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) return;

        for (let i = 1; i <= dogadjaj.brojMjesta; i++) {
            await addDoc(colRef, {
                dogadjajSifra: String(dogadjaj.sifra),
                broj: Number(i),
                rezervirano: false,
                rezervacijaSifra: null
            });
        }

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// REZERVIRAJ KARTE
async function rezervirajKarte(dogadjajSifra, brojevi, rezervacijaSifra) {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KARTE);
        const q = query(colRef, where("dogadjajSifra", "==", String(dogadjajSifra)));
        const snapshot = await getDocs(q);

        for (let d of snapshot.docs) {
            const k = d.data();
            if (brojevi.includes(k.broj)) {
                await updateDoc(doc(getFirebaseDB(), PrefixStorage.KARTE, d.id), {
                    rezervirano: true,
                    rezervacijaSifra: String(rezervacijaSifra)
                });
            }
        }

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// OSLOBODI KARTE
async function oslobodiKarte(rezervacijaSifra) {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KARTE);
        const q = query(colRef, where("rezervacijaSifra", "==", String(rezervacijaSifra)));
        const snapshot = await getDocs(q);

        for (let d of snapshot.docs) {
            await updateDoc(doc(getFirebaseDB(), PrefixStorage.KARTE, d.id), {
                rezervirano: false,
                rezervacijaSifra: null
            });
        }

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// OBRISI KARTE ZA DOGADJAJ
async function obrisiZaDogadjaj(dogadjajSifra) {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KARTE);
        const q = query(colRef, where("dogadjajSifra", "==", String(dogadjajSifra)));
        const snapshot = await getDocs(q);

        for (let d of snapshot.docs) {
            await deleteDoc(doc(getFirebaseDB(), PrefixStorage.KARTE, d.id));
        }

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// DODAJ KARTU (koristi se kod pretakanja memorije → Firebase)
async function dodaj(karta) {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.KARTE);
        const docRef = await addDoc(colRef, karta);

        await updateDoc(docRef, { sifra: docRef.id });

        return { 
            success: true, 
            data: { sifra: docRef.id, ...karta }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}



export default {
    get,
    getByDogadjaj,
    generirajZaDogadjaj,
    rezervirajKarte,
    oslobodiKarte,
    obrisiZaDogadjaj,
    dodaj
};
