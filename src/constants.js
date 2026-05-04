export const IME_APLIKACIJE = 'Event Booking APP';

export const RouteNames = {
    HOME: '/',
    DOGADJAJI: '/dogadjaji',
    DOGADJAJI_NOVI: '/dogadjaji/novi',
    DOGADJAJI_PROMJENA: '/dogadjaji/:sifra',

    KORISNICI: '/korisnici',
    KORISNICI_NOVI: '/korisnici/novi',
    KORISNICI_PROMJENA: '/korisnici/:sifra',

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
    REZERVACIJE: 'rezervacije'
};
