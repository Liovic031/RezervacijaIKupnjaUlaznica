import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Container, Card, Alert } from "react-bootstrap";
import { RouteNames } from "../../constants";
import { ShemaPromjenaLozinke } from "../../schemas/ShemaPromjenaLozinke";
import KorisnikService from "../../services/korisnici/KorisnikService";
import useAuth from "../../hooks/useAuth";

export default function KorisnikPromjenaLozinke() {
  const navigate = useNavigate();
  const { sifra } = useParams(); // dohvaća ID iz URL-a
  const { authUser } = useAuth(); // ulogirani korisnik
  const [errors, setErrors] = useState({});

  async function promjeniLozinku(novaLozinka) {
    const rezultat = await KorisnikService.promjeniLozinku(sifra, novaLozinka);

    if (rezultat.success) {
      alert("Lozinka uspješno promijenjena!");
      navigate(RouteNames.NADZORNA_PLOCA);
    } else {
      alert(rezultat.message || "Greška pri promjeni lozinke");
    }
  }

  function odradiSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    setErrors({});
    const objekt = Object.fromEntries(podaci);

    const rezultat = ShemaPromjenaLozinke.safeParse(objekt);

    if (!rezultat.success) {
      const greske = {};
      rezultat.error.issues.forEach(issue => {
        greske[issue.path[0]] = issue.message;
      });
      setErrors(greske);
      return;
    }

    promjeniLozinku(podaci.get("novaLozinka"));
  }

  return (
    <>
      <h3>Promjena lozinke</h3>

      <Form onSubmit={odradiSubmit}>
        <Container className="mt-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">
                Promjena lozinke za: <strong>{authUser?.email}</strong>
              </Card.Title>

              <Alert variant="info">
                <strong>Zahtjevi za lozinku:</strong>
                <ul className="mb-0 mt-2">
                  <li>Najmanje 8 znakova</li>
                  <li>Barem jedno veliko slovo</li>
                  <li>Barem jedno malo slovo</li>
                  <li>Barem jedan broj</li>
                  <li>Barem jedan specijalni znak</li>
                </ul>
              </Alert>

              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nova lozinka</Form.Label>
                    <Form.Control
                      type="password"
                      name="novaLozinka"
                      isInvalid={!!errors.novaLozinka}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.novaLozinka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Potvrda lozinke</Form.Label>
                    <Form.Control
                      type="password"
                      name="potvrdaLozinke"
                      isInvalid={!!errors.potvrdaLozinke}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.potvrdaLozinke}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="success">
                  Promijeni lozinku
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </Form>
    </>
  );
}
