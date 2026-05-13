import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { DATA_SOURCE, IME_APLIKACIJE } from "../constants";
import { useEffect, useState } from "react";
import DogadjajService from "../services/dogadjaji/DogadjajService";
import KorisnikService from "../services/korisnici/KorisnikService";
import RezervacijaService from "../services/rezervacije/RezervacijaService";
import { Card, Row, Col } from "react-bootstrap";
import useAuth from "../hooks/useAuth";


export default function Home() {

  const [brojDogadjaja, setBrojDogadjaja] = useState(0);
  const [brojKorisnika, setBrojKorisnika] = useState(0);
  const [brojRezervacija, setBrojRezervacija] = useState(0);

  const [animatedDogadjaji, setAnimatedDogadjaji] = useState(0);
  const [animatedKorisnici, setAnimatedKorisnici] = useState(0);
  const [animatedRezervacije, setAnimatedRezervacije] = useState(0);

  const { isLoggedIn } = useAuth();

  function promijeniIzvor(novi) {
    localStorage.setItem("dataSource", novi);
    window.location.reload();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dog = await DogadjajService.get();
        const kor = await KorisnikService.get();
        const rez = await RezervacijaService.get();

        setBrojDogadjaja(dog.data.length);
        setBrojKorisnika(kor.data.length);
        setBrojRezervacija(rez.data.length);

      } catch (error) {
        console.error('Greška: ', error);
      }
    };

    fetchData();
  }, []);

  // animacije brojeva
  useEffect(() => {
    if (animatedDogadjaji < brojDogadjaja) {
      setTimeout(() => setAnimatedDogadjaji(prev => prev + 1), 200);
    }
  }, [animatedDogadjaji, brojDogadjaja]);

  useEffect(() => {
    if (animatedKorisnici < brojKorisnika) {
      setTimeout(() => setAnimatedKorisnici(prev => prev + 1), 100);
    }
  }, [animatedKorisnici, brojKorisnika]);

  useEffect(() => {
    if (animatedRezervacije < brojRezervacija) {
      setTimeout(() => setAnimatedRezervacije(prev => prev + 1), 150);
    }
  }, [animatedRezervacije, brojRezervacija]);

  return (
    <>
      <div className="pocetna">
        <h1>
          Dobrodošli na {IME_APLIKACIJE}
        </h1>

        <p className="uvod">
          Ovdje možete pregledati najnovije događaje, korisnike i rezervacije na našoj platformi.
        </p>
      </div>


      <div className="statistika-red">
        <Card className="shadow-lg border-0 statistikaPanel">
          <Card.Body className="text-center">
            <p className="text-white">Događaji</p>
            <div className="statistikaTekst">{animatedDogadjaji}</div>
          </Card.Body>
        </Card>

        <Card className="shadow-lg border-0 statistikaPanel">
          <Card.Body className="text-center">
            <p className="text-white">Korisnici</p>
            <div className="statistikaTekst">{animatedKorisnici}</div>
          </Card.Body>
        </Card>

        <Card className="shadow-lg border-0 statistikaPanel">
          <Card.Body className="text-center">
            <p className="text-white">Rezervacije</p>
            <div className="statistikaTekst">{animatedRezervacije}</div>
          </Card.Body>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <DotLottieReact
          src="/animations/ticketblue.lottie"
          loop
          autoplay
          style={{ width: 260, height: 260 }}
        />

      </div>

      {isLoggedIn && (
        <>
          <hr className="mt-5" />

          <Row className="mb-5">
            <Col className="text-center">
              <h5>Izvor podataka:</h5>
              <div className="btn-group">
                <button
                  onClick={() => promijeniIzvor('memorija')}
                  className={`btn ${DATA_SOURCE === 'memorija' ? 'btn-success' : 'btn-danger'}`}
                >
                  Memorija
                </button>

                <button
                  onClick={() => promijeniIzvor('localstorage')}
                  className={`btn ${DATA_SOURCE === 'localstorage' ? 'btn-success' : 'btn-danger'}`}
                >
                  Local Storage
                </button>

                <button
                  onClick={() => promijeniIzvor('firebase')}
                  className={`btn ${DATA_SOURCE === 'firebase' ? 'btn-success' : 'btn-danger'}`}
                >
                  Firebase
                </button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}