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


function App() {


  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.DOGADJAJI} element={<DogadjajPregled />} />
        <Route path={RouteNames.DOGADJAJI_NOVI} element={<DogadjajNovi />} />
        <Route path={RouteNames.DOGADJAJI_PROMJENA} element={<DogadjajPromjena />}/>
      </Routes>
      <hr />
      <div className='footer'>&copy; Event Booking APP</div>
    </Container>
  )
}

export default App
