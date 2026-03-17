import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { RouteNames } from './constants'
import DogadjajPregled from './pages/dogadjaji/DogadjajPregled'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {


  return (
    <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.DOGADJAJI} element={<DogadjajPregled />} />
      </Routes>
      <hr />
      &copy; Edunova
    </Container>
  )
}

export default App
