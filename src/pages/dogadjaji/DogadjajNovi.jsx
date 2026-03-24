import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import DogadjajService from "../../services/dogadjaji/DogadjajService";

export default function DogadjajNovi(){
    const navigate = useNavigate();

    async function dodaj(dogadjaj){
        await DogadjajService.dodaj(dogadjaj).then(()=>{
            navigate(RouteNames.DOGADJAJI)
        })
    }

    function odradiSubmit(e){
        e.preventDefault();
        const podaci = new FormData(e.target);
        dodaj({
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
                <Form.Control type="text" name="naziv" required/>
            </Form.Group>
            <Form.Group controlId="lokacija">
                <Form.Label>Lokacija</Form.Label>
                <Form.Control type="text" name="lokacija"/>
            </Form.Group>
            <Form.Group controlId="datumOdrzavanja">
                    <Form.Label>Datum održavanja</Form.Label>
                    <Form.Control type="date" name="datumOdrzavanja" />
                </Form.Group>
            <Form.Group controlId="dostupnoMjesta">
                <Form.Label>Dostupna Mjesta</Form.Label>
                <Form.Control type="number" name="dostupnoMjesta" step={1}/>
            </Form.Group>
            <Form.Group controlId="brojMjesta">
                <Form.Label>Broj Mjesta</Form.Label>
                <Form.Control type="number" name="brojMjesta"/>
            </Form.Group>
            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" name="cijena" step={0.01}/>
            </Form.Group>
            <Form.Group controlId="aktivan">
                    <Form.Check label="aktivan" name="aktivan"/>
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
                    Dodaj novi događaj
                </Button>
            </Col>
        </Row>
        </Form>

        

        

        </>
    )
}