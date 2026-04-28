import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { RouteNames } from './constants'
import DogadjajPregled from './pages/dogadjaji/DogadjajPregled'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
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


function App() {


  return (
    <>
      <LoadingSpinner />
      <Container style={{ backgroundColor: window.location.hostname === 'localhost' ? '#ffefea' : 'none' }}>
        <Izbornik />
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.DOGADJAJI} element={<DogadjajPregled />} />
          <Route path={RouteNames.DOGADJAJI_NOVI} element={<DogadjajNovi />} />
          <Route path={RouteNames.DOGADJAJI_PROMJENA} element={<DogadjajPromjena />} />
          <Route path={RouteNames.KORISNICI} element={<KorisnikPregled />} />
          <Route path={RouteNames.KORISNICI_NOVI} element={<KorisnikNovi />} />
          <Route path={RouteNames.KORISNICI_PROMJENA} element={<KorisnikPromjena />} />
          <Route path={RouteNames.REZERVACIJE} element={<RezervacijaPregled />} />
          <Route path={RouteNames.REZERVACIJE_PROMJENA} element={<RezervacijaPromjena />} />
          <Route path={RouteNames.REZERVACIJE_NOVE} element={<RezervacijaNova />} />
          <Route path={RouteNames.REZERVACIJE_EVIDENTIRAJ} element={<RezervacijaEvidentiraj />} />
          <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<GeneriranjePodataka />} />
        </Routes>
        <hr />
        <div className='footer'>&copy; Event Booking APP</div>
      </Container>
    </>
  )
}

export default App
