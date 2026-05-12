import { Button, Col, Form, Row, Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisnikService from "../../services/korisnici/KorisnikService";
import { useEffect, useRef, useState } from "react";
import { ShemaKorisnik } from "../../schemas/ShemaKorisnik";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function KorisnikPromjena() {

    const navigate = useNavigate();
    const params = useParams();

    const [korisnik, setKorisnik] = useState({});
    const [errors, setErrors] = useState({});

    const [slikaZaCrop, setSlikaZaCrop] = useState(null);
    const cropperRef = useRef(null);


    async function ucitajKorisnik() {
        const odgovor = await KorisnikService.getBySifra(params.sifra);

        if (!odgovor.success) {
            alert("Nije implementiran servis");
            return;
        }

        setKorisnik(odgovor.data);
    }

    useEffect(() => {
        ucitajKorisnik();
    }, []);

    async function promjeni(korisnik) {
        await KorisnikService.promjeni(params.sifra, korisnik).then(() => {
            navigate(RouteNames.KORISNICI);
        });
    }

    function odradiSubmit(e) {
        e.preventDefault();
        setErrors({});

        const podaci = new FormData(e.target);
        const objekt = Object.fromEntries(podaci);

        let dataUrl = korisnik.slika; // ako ne mijenja sliku, ostaje stara

        if (cropperRef.current && slikaZaCrop) {
            const cropper = cropperRef.current.cropper;

            const selectionData = cropper.getData(true);
            const actualWidth = selectionData.width;
            const actualHeight = selectionData.height;
            const targetSize = 200;

            const canvasWidth = actualWidth > targetSize ? targetSize : actualWidth;
            const canvasHeight = actualHeight > targetSize ? targetSize : actualHeight;

            const canvas = cropper.getCroppedCanvas({
                width: canvasWidth,
                height: canvasHeight,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            dataUrl = canvas.toDataURL('image/png');
        }

        // ZOD VALIDACIJA
        const rezultat = ShemaKorisnik.safeParse(objekt);

        if (!rezultat.success) {
            const greske = {};

            rezultat.error.issues.forEach(issue => {
                const kljuc = issue.path[0];
                if (!greske[kljuc]) {
                    greske[kljuc] = issue.message;
                }
            });

            setErrors(greske);
            return;
        }

        promjeni({
            ...rezultat.data,
            slika: dataUrl
        });

    }

    const ocistiGresku = (polje) => {
        if (errors[polje]) {
            const nove = { ...errors };
            delete nove[polje];
            setErrors(nove);
        }
    };

    function onChangeImage(e) {
        e.preventDefault();

        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setSlikaZaCrop(reader.result);
        };

        try {
            reader.readAsDataURL(files[0]);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>
            <h3 className="mb-4">Promjena korisnika</h3>

            <Form noValidate onSubmit={odradiSubmit}>
                <Container>
                    <Card className="p-3">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h5 className="text-center mb-3">Trenutna slika</h5>

                                    <div className="mb-4 text-center">
                                        <img
                                            src={korisnik.slika}
                                            alt="korisnik"
                                            style={{
                                                width: 150,
                                                height: 150,
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "2px solid #ddd",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                                            }}
                                        />
                                    </div>

                                    <Form.Group className="mb-4" controlId="ime">
                                        <Form.Label>Ime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ime"
                                            defaultValue={korisnik.ime}
                                            isInvalid={!!errors.ime}
                                            onFocus={() => ocistiGresku("ime")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.ime}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="prezime">
                                        <Form.Label>Prezime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="prezime"
                                            defaultValue={korisnik.prezime}
                                            isInvalid={!!errors.prezime}
                                            onFocus={() => ocistiGresku("prezime")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.prezime}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            defaultValue={korisnik.email}
                                            isInvalid={!!errors.email}
                                            onFocus={() => ocistiGresku("email")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Card className="p-3 shadow-sm" style={{ borderRadius: "12px" }}>
                                        <h5 className="fw-bold mb-3">Nova slika</h5>

                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            className="mb-3"
                                            onChange={onChangeImage}
                                        />

                                        {slikaZaCrop ? (
                                            <Cropper
                                                src={slikaZaCrop}
                                                style={{
                                                    height: 300,
                                                    width: "100%",
                                                    borderRadius: "12px",
                                                    overflow: "hidden"
                                                }}
                                                initialAspectRatio={1}
                                                guides={false}
                                                autoCropArea={1}
                                                viewMode={1}
                                                minCropBoxWidth={200}
                                                minCropBoxHeight={200}
                                                cropBoxResizable={false}
                                                background={false}
                                                responsive={true}
                                                checkOrientation={false}
                                                ref={cropperRef}
                                            />
                                        ) : (
                                            <div
                                                className="d-flex align-items-center justify-content-center text-muted"
                                                style={{
                                                    height: 300,
                                                    border: "2px dashed #bbb",
                                                    borderRadius: "12px",
                                                    background: "#fafafa"
                                                }}
                                            >
                                                Odaberite sliku za uređivanje
                                            </div>
                                        )}
                                    </Card>
                                </Col>
                            </Row>

                            <hr />
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button type="submit" variant="success" className="px-4">
                                    Spremi
                                </Button>
                                <Link to={RouteNames.KORISNICI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </Form>
        </>
    );
}
