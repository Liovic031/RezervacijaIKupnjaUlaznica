
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { RouteNames } from './constants'
import DogadjajPregled from './pages/dogadjaji/DogadjajPregled'

function App() {


  return (
    <>
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.DOGADJAJI} element={<DogadjajPregled />} />
      </Routes>
      <hr />
      &copy; Edunova
    </>
  )
}

export default App
