// src/constants.js
export const IME_APLIKACIJE = 'Event Booking APP';

export const RouteNames = {
    HOME: '/',
    LOGIN: '/login',
    REGISTRACIJA: '/registracija',
    NADZORNA_PLOCA: '/nadzorna',

    DOGADJAJI: '/dogadjaji',
    DOGADJAJI_NOVI: '/dogadjaji/novi',
    DOGADJAJI_PROMJENA: '/dogadjaji/:sifra',

    KORISNICI: '/korisnici',
    KORISNICI_NOVI: '/korisnici/novi',
    KORISNICI_PROMJENA: '/korisnici/:sifra',
    KORISNICI_PROMJENA_LOZINKE: '/korisnici/:sifra/lozinka',


    REZERVACIJE: '/rezervacije',
    REZERVACIJE_NOVE: '/rezervacije/nove',
    REZERVACIJE_PROMJENA: '/rezervacije/:sifra',

    REZERVACIJE_EVIDENTIRAJ: '/rezervacije/evidentiraj/:sifra',

    GENERIRANJE_PODATAKA: '/generiranje'
};

// memorija, localstorage, firebase
export const DATA_SOURCE = 'localstorage';

// PrefixStorage – tvoja verzija profesorovog
export const PrefixStorage = {
    DOGADJAJI: 'dogadjaji',
    KORISNICI: 'korisnici',
    KARTE: 'karte',
    REZERVACIJE: 'rezervacije',
    AUTH_USER: 'auth_user' // dodano: ključ za pohranu prijavljenog korisnika
};
