import { Container, Nav, Navbar } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { IME_APLIKACIJE, RouteNames } from "../constants"

export default function Izbornik() {

    const navigate = useNavigate()

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
            <Container>

                <Navbar.Brand onClick={() => navigate(RouteNames.HOME)}>
                    {IME_APLIKACIJE}
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate(RouteNames.HOME)}>Home</Nav.Link>
                        <Nav.Link onClick={() => navigate(RouteNames.DOGADJAJI)}>Događaji</Nav.Link>
                        <Nav.Link onClick={() => navigate(RouteNames.KORISNICI)}>Korisnici</Nav.Link>
                        <Nav.Link onClick={() => navigate(RouteNames.REZERVACIJE)}>Rezervacije</Nav.Link>
                        <Nav.Link onClick={() => navigate(RouteNames.GENERIRANJE_PODATAKA)}>Generiranje podataka</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}