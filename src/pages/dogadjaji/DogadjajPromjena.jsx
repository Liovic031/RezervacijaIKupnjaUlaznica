import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import DogadjajService from "../../services/dogadjaji/DogadjajService";
import { useEffect, useState } from "react";

export default function DogadjajPromjena(){
    const navigate = useNavigate();
    const params = useParams();
    const [dogadjaj, setDogadjaj] = useState({})
    const [aktivan, setAktivan] = useState(false)

    async function ucitajDogadjaj() {
        await DogadjajService.getBySifra(params.sifra).then((odgovor)=>{
            const d = odgovor.data
            d.datumOdrzavanja = d.datumOdrzavanja.substring(0,10)

            setDogadjaj(d)
            setAktivan(d.aktivan)
        })
    }


    useEffect(()=>{
        ucitajDogadjaj()
    },[])



    async function promjeni(dogadjaj){
        await DogadjajService.promjeni(dogadjaj).then(()=>{
            navigate(RouteNames.DOGADJAJI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault();
        const podaci = new FormData(e.target);
        promjeni({
            naziv: podaci.get('naziv'),
            lokacija: podaci.get('lokacija'),
            datumOdrzavanja: new Date(podaci.get('datumOdrzavanja')).toISOString(),
            dostupnoMjesta: parseInt(podaci.get('dostupnoMjesta')),
            brojMjesta: parseInt(podaci.get('brojMjesta')),
            cijena: parseFloat(podaci.get('cijena')),
            aktivan: podaci.get('aktivan') === 'on'
        })
    }


    return(
        <>
        <h3>Unos novog događaja</h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" required defaultValue={dogadjaj.naziv}/>
            </Form.Group>
            <Form.Group controlId="lokacija">
                <Form.Label>Lokacija</Form.Label>
                <Form.Control type="text" name="lokacija" defaultValue={dogadjaj.lokacija}/>
            </Form.Group>
            <Form.Group controlId="datumOdrzavanja">
                    <Form.Label>Datum održavanja</Form.Label>
                    <Form.Control type="date" name="datumOdrzavanja" defaultValue={dogadjaj.datumOdrzavanja}/>
                </Form.Group>
            <Form.Group controlId="dostupnoMjesta">
                <Form.Label>Dostupna Mjesta</Form.Label>
                <Form.Control type="number" name="dostupnoMjesta" step={1} defaultValue={dogadjaj.dostupnoMjesta}/>
            </Form.Group>
            <Form.Group controlId="brojMjesta">
                <Form.Label>Broj Mjesta</Form.Label>
                <Form.Control type="number" name="brojMjesta" step={1} defaultValue={dogadjaj.brojMjesta}/>
            </Form.Group>
            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" name="cijena" step={0.01} defaultValue={dogadjaj.cijena}/>
            </Form.Group>
            <Form.Group controlId="aktivan">
                    <Form.Check label="aktivan" name="aktivan" checked={aktivan} onChange={(e)=>{setAktivan(e.target.checked)}}/>
            </Form.Group>

            <hr style={{marginTop: '30px', border: '0'}}/>
            
            <Row>
            <Col>
                <Link to={RouteNames.DOGADJAJI} className="btn btn-danger">
                    Odustani
                </Link>
            </Col>
            <Col>
                <Button type="submit" variant="success">
                    Promjeni
                </Button>
            </Col>
        </Row>
        </Form>

        

        

        </>
    )
}