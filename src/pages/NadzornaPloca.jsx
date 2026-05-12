import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import DogadjajService from "../services/dogadjaji/DogadjajService";
import KartaService from "../services/karte/KartaService";
import RezervacijaService from "../services/rezervacije/RezervacijaService";

import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";

export default function NadzornaPloca() {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const [statistika, setStatistika] = useState([]);

  async function ucitajAdminStatistiku() {
    const d = await DogadjajService.get();
    if (!d.success) return;

    const lista = [];

    for (let dog of d.data) {
      const k = await KartaService.getByDogadjaj(dog.sifra);

      const ukupno = k.data.length;
      const rezervirano = k.data.filter(x => x.rezervirano).length;
      const slobodno = ukupno - rezervirano;

      lista.push({
        naziv: dog.naziv,
        ukupno,
        rezervirano,
        slobodno
      });
    }

    setStatistika(lista);
  }

  async function ucitajKorisnikStatistiku() {
    const rez = await RezervacijaService.get();
    if (!rez.success) return;

    const moje = rez.data.filter(r => String(r.korisnikSifra) === String(authUser.sifra));

    const lista = [];

    for (let r of moje) {
      const dog = await DogadjajService.getBySifra(r.dogadjajSifra);
      const karte = await KartaService.getByDogadjaj(r.dogadjajSifra);

      const ukupno = karte.data.length;
      const rezervirano = karte.data.filter(x => x.rezervirano).length;
      const slobodno = ukupno - rezervirano;

      lista.push({
        naziv: dog.data.naziv,
        ukupno,
        rezervirano,
        slobodno
      });
    }

    setStatistika(lista);
  }

  useEffect(() => {
    if (authUser?.uloga === "admin") ucitajAdminStatistiku();
    else ucitajKorisnikStatistiku();
}, [authUser]);

  function chartOptions(dog) {
    return {
      chart: { type: "pie" },
      title: { text: dog.naziv },
      tooltip: { pointFormat: "<b>{point.y}</b>" },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          dataLabels: { enabled: true }
        }
      },
      series: [
        {
          name: "Karte",
          colorByPoint: true,
          data: [
            { name: "Slobodno", y: dog.slobodno, color: "#28a745" },
            { name: "Rezervirano", y: dog.rezervirano, color: "#dc3545" }
          ]
        }
      ]
    };
  }


  return (
    <Container className="mt-4">
      <h2 className="mb-4">Nadzorna ploča</h2>

      <Card className="shadow-sm p-4 mb-4">
        <p className="fs-5"><strong>Email:</strong> {authUser.email}</p>

        <Button
          variant="warning"
          className="px-4"
          onClick={() => navigate(`/korisnici/${authUser.sifra}/lozinka`)}
        >
          Promijeni lozinku
        </Button>
      </Card>

      <h4 className="mb-3">
        {authUser.uloga === "admin"
          ? "Statistika svih događaja"
          : "Statistika vaših rezervacija"}
      </h4>

      <Row>
        {statistika.map((dog, i) => (
          <Col md={6} key={i} className="mb-4">
            <Card className="shadow-sm p-3">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions(dog)}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
