import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes, Navigate } from 'react-router-dom'
import { IME_APLIKACIJE, RouteNames } from './constants'
import Home from './pages/Home'
import DogadjajPregled from './pages/dogadjaji/DogadjajPregled'
import DogadjajNovi from './pages/dogadjaji/DogadjajNovi'
import DogadjajPromjena from './pages/dogadjaji/DogadjajPromjena'
import KorisnikPregled from './pages/korisnici/KorisnikPregled'
import KorisnikNovi from './pages/korisnici/KorisnikNovi'
import KorisnikPromjena from './pages/korisnici/KorisnikPromjena'
import RezervacijaPregled from './pages/rezervacije/RezervacijaPregled'
import RezervacijaPromjena from './pages/rezervacije/RezervacijaPromjena'
import RezervacijaNova from './pages/rezervacije/RezervacijaNova'
import RezervacijaEvidentiraj from './pages/rezervacije/RezervacijaEvidentiraj'
import GeneriranjePodataka from './pages/generiranje/GeneriranjePodataka'
import LoadingSpinner from './components/LoadingSpinner'
import Login from './pages/Login'
import Registracija from './pages/Registracija'
import NadzornaPloca from './pages/NadzornaPloca'
import useAuth from './hooks/useAuth'
import KorisnikPromjenaLozinke from './pages/korisnici/KorisnikPromjenaLozinke'

function App() {
  const { isLoggedIn, authUser } = useAuth()

  return (
    <>
      <LoadingSpinner />
      <Container style={{ backgroundColor: window.location.hostname === 'localhost' ? '#ffefea' : 'none' }}>
        <Izbornik />
        <Routes>
          {/* javne rute */}
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.LOGIN} element={<Login />} />
          <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />

          {/* rute dostupne samo prijavljenima (uvjetno) */}
          {isLoggedIn && (
            <>
              <Route path={RouteNames.NADZORNA_PLOCA} element={<NadzornaPloca />} />
              <Route path={RouteNames.KORISNICI_PROMJENA_LOZINKE} element={<KorisnikPromjenaLozinke />} />


              <Route path={RouteNames.DOGADJAJI || '/dogadjaji'} element={<DogadjajPregled />} />
              <Route path={RouteNames.KORISNICI || '/korisnici'} element={<KorisnikPregled />} />
              <Route path={RouteNames.KORISNICI_NOVI || '/korisnici/novi'} element={<KorisnikNovi />} />
              <Route path={RouteNames.KORISNICI_PROMJENA || '/korisnici/:sifra'} element={<KorisnikPromjena />} />
              {authUser?.uloga === 'admin' && (
                <>
                  <Route path={RouteNames.DOGADJAJI_NOVI || '/dogadjaji/novi'} element={<DogadjajNovi />} />
                  <Route path={RouteNames.DOGADJAJI_PROMJENA || '/dogadjaji/:sifra'} element={<DogadjajPromjena />} />
                </>
              )}
              <Route path={RouteNames.REZERVACIJE || '/rezervacije'} element={<RezervacijaPregled />} />
              <Route path={RouteNames.REZERVACIJE_NOVE || '/rezervacije/novi'} element={<RezervacijaNova />} />
              <Route path={RouteNames.REZERVACIJE_PROMJENA || '/rezervacije/:sifra'} element={<RezervacijaPromjena />} />
              {authUser?.uloga === 'admin' && (
                <Route path={RouteNames.REZERVACIJE_EVIDENTIRAJ || '/rezervacije/evidentiraj/:sifra'} element={<RezervacijaEvidentiraj />} />
              )}

              {authUser?.uloga === 'admin' && (
                <Route path={RouteNames.GENERIRANJE_PODATAKA || '/generiranje'} element={<GeneriranjePodataka />} />
              )}
            </>
          )}

          {/* fallback */}
          <Route path="*" element={<Navigate to={RouteNames.HOME || '/'} replace />} />
        </Routes>

        <hr />
        <footer>
          <div className='footer'>&copy; Event Booking APP</div>
        </footer>
      </Container>
    </>
  )
}

export default App
