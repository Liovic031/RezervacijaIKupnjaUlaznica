import React from 'react'
import { Container, Nav, Navbar, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import useAuth from '../hooks/useAuth'
import { IME_APLIKACIJE, RouteNames } from "../constants"

export default function Izbornik() {
  const { isLoggedIn, authUser, logout } = useAuth()

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={RouteNames?.HOME || '/'}>{IME_APLIKACIJE}</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={RouteNames?.HOME || '/'}>Home</Nav.Link>
            <Nav.Link as={Link} to={RouteNames?.DOGADJAJI || '/dogadjaji'}>Događaji</Nav.Link>
            <Nav.Link as={Link} to={RouteNames?.REZERVACIJE || '/rezervacije'}>Rezervacije</Nav.Link>
            {authUser?.uloga === 'admin' && (
              <>
                <Nav.Link as={Link} to={RouteNames?.KORISNICI || '/korisnici'}>Korisnici</Nav.Link>
                <Nav.Link as={Link} to={RouteNames?.GENERIRANJE_PODATAKA || '/generiranje'}>Generiranje podataka</Nav.Link>
              </>
            )}
            {authUser && (
              <Nav.Link as={Link} to={RouteNames.NADZORNA_PLOCA}>
                Nadzorna ploča
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                <span className="text-light me-3 align-self-center">{authUser?.email}</span>
                <Button variant="outline-light" onClick={() => logout()}>Logout</Button>
              </>
            ) : (
              <>
                <Button className="me-2" variant="outline-light" as={Link} to={RouteNames?.REGISTRACIJA || '/registracija'}>Registracija</Button>
                <Button variant="light" as={Link} to={RouteNames?.LOGIN || '/login'}>Login</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
