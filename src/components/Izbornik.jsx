import { Container, Nav, Navbar } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { IME_APLIKACIJE, RouteNames } from "../constants"
export default function Izbornik() {

    const navigate = useNavigate()

    return (

        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand onClick={() => navigate(RouteNames.HOME)}>{IME_APLIKACIJE}</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={() => navigate(RouteNames.HOME)}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigate(RouteNames.DOGADJAJI)}>Događaji</Nav.Link>
                    <Nav.Link onClick={() => navigate(RouteNames.KORISNICI)}>Korisnici</Nav.Link>
                </Nav>
            </Container>
        </Navbar>

    )
}
