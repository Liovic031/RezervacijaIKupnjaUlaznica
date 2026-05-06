import React from "react";
import useAuth from "../hooks/useAuth";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function NadzornaPloca() {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2>Nadzorna ploča</h2>
          <p>Dobrodošli, <strong>{authUser?.email}</strong></p>
          <p>Uloga: <strong>{authUser?.uloga}</strong></p>

          <hr />
          <Button
            variant="warning"
            onClick={() => navigate(`/korisnici/${authUser.sifra}/lozinka`)}
          >
            Promijeni lozinku
          </Button>

        </Card.Body>
      </Card>
    </Container>
  );
}
