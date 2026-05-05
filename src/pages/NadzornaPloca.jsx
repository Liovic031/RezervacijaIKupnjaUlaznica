import React from "react";
import useAuth from "../hooks/useAuth";
import { Container, Card } from "react-bootstrap";

export default function NadzornaPloca() {
  const { authUser } = useAuth();

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2>Nadzorna ploča</h2>
          <p>Dobrodošli, <strong>{authUser?.email}</strong></p>
          <p>Uloga: <strong>{authUser?.uloga}</strong></p>

          <hr />
        </Card.Body>
      </Card>
    </Container>
  );
}
