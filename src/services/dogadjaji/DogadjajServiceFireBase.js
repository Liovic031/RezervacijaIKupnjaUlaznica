import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";
import KartaService from "../karte/KartaService";

// 1/4 - GET ALL
async function get() {
    try {
        const colRef = collection(getFirebaseDB(), PrefixStorage.DOGADJAJI);
        const snapshot = await getDocs(colRef);

        const data = snapshot.docs.map(d => {
            const item = d.data();

            return {
                sifra: d.id,
                ...item,
                datumOdrzavanja: item.datumOdrzavanja.toDate().toISOString()
            };
        });

        return { success: true, data };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 2/4 - GET BY ID
async function getBySifra(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.DOGADJAJI, sifra);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
            return { success: false, message: "Događaj ne postoji" };
        }

        const item = snap.data();

        return {
            success: true,
            data: {
                sifra: snap.id,
                ...item,
                datumOdrzavanja: item.datumOdrzavanja.toDate().toISOString()
            }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 3/4 - CREATE
async function dodaj(dogadjaj) {
    try {
        dogadjaj.datumOdrzavanja = Timestamp.fromDate(new Date(dogadjaj.datumOdrzavanja));

        const colRef = collection(getFirebaseDB(), PrefixStorage.DOGADJAJI);
        const docRef = await addDoc(colRef, dogadjaj);

        await updateDoc(docRef, { sifra: docRef.id });

        await KartaService.generirajZaDogadjaj({
            sifra: docRef.id,
            brojMjesta: Number(dogadjaj.brojMjesta)
        });

        return { 
            success: true, 
            data: { sifra: docRef.id, ...dogadjaj }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}


// 4/4 - UPDATE
async function promjeni(sifra, dogadjaj) {
    try {
        dogadjaj.datumOdrzavanja = Timestamp.fromDate(new Date(dogadjaj.datumOdrzavanja));

        const docRef = doc(getFirebaseDB(), PrefixStorage.DOGADJAJI, sifra);
        await updateDoc(docRef, dogadjaj);

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// DELETE
async function obrisi(sifra) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.DOGADJAJI, sifra);
        await deleteDoc(docRef);

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default { get, getBySifra, dodaj, promjeni, obrisi };
