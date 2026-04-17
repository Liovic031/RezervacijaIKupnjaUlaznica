import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function RezervacijaPDFGenerator({ rezervacija, dogadjaj, korisnik }) {

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await response.blob();

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.readAsDataURL(blob);
        });
    };

    const generirajPDF = async () => {

        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64("/fonts/Roboto-Regular.ttf"),
            fetchFontAsBase64("/fonts/Roboto-Bold.ttf")
        ]);

        const doc = new jsPDF();

        // Registracija fontova
        doc.addFileToVFS("Roboto-Regular.ttf", regBase64);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

        doc.addFileToVFS("Roboto-Bold.ttf", boldBase64);
        doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

        // HEADER
        doc.setFont("Roboto", "bold");
        doc.setFontSize(20);
        doc.text("Potvrda rezervacije", 105, 20, { align: "center" });

        // Zelena linija ispod naslova
        doc.setDrawColor(46, 125, 50);
        doc.setLineWidth(0.8);
        doc.line(20, 25, 190, 25);

        let y = 40;

        // SEKCIJA: Podaci o događaju
        doc.setFont("Roboto", "bold");
        doc.setFontSize(14);
        doc.text("Podaci o događaju", 20, y);
        y += 8;

        doc.setFont("Roboto", "normal");
        doc.setFontSize(12);
        doc.text(`Naziv: ${dogadjaj.naziv}`, 25, y); y += 7;
        doc.text(`Datum održavanja: ${new Date(dogadjaj.datumOdrzavanja).toLocaleDateString("hr-HR")}`, 25, y); y += 12;

        // SEKCIJA: Podaci o korisniku
        doc.setFont("Roboto", "bold");
        doc.setFontSize(14);
        doc.text("Podaci o korisniku", 20, y);
        y += 8;

        doc.setFont("Roboto", "normal");
        doc.setFontSize(12);
        doc.text(`Ime i prezime: ${korisnik.ime} ${korisnik.prezime}`, 25, y); y += 7;
        doc.text(`Datum rezervacije: ${new Date(rezervacija.datumRezervacije).toLocaleDateString("hr-HR")}`, 25, y); y += 12;

        // SEKCIJA: Detalji rezervacije
        doc.setFont("Roboto", "bold");
        doc.setFontSize(14);
        doc.text("Detalji rezervacije", 20, y);
        y += 8;

        doc.setFont("Roboto", "normal");
        doc.setFontSize(12);
        doc.text(`Broj karata: ${rezervacija.brojeviKarata.length}`, 25, y); y += 7;

        const ukupno = dogadjaj.cijena * rezervacija.brojeviKarata.length;
        doc.text(`Ukupna cijena: ${ukupno.toFixed(2)} €`, 25, y);
        y += 15;

        // Naslov tablice
        doc.setFont("Roboto", "bold");
        doc.setFontSize(14);
        doc.text("Popis karata", 20, y);
        y += 6;

        // Tablica
        autoTable(doc, {
            startY: y,
            head: [["Karta br."]],
            body: rezervacija.brojeviKarata.map(b => [b]),

            margin: { left: 20, right: 20 },

            styles: {
                font: "Roboto",
                fontStyle: "normal",
                fontSize: 11,
                cellPadding: 4,
                lineWidth: 0.2,
                lineColor: [180, 180, 180]
            },

            headStyles: {
                font: "Roboto",
                fontStyle: "bold",
                fillColor: [46, 125, 50],
                textColor: [255, 255, 255],
                halign: "center"
            },

            columnStyles: {
                0: { halign: "center" }
            }
        });

        // footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
            `Generirano: ${new Date().toLocaleString("hr-HR")}`,
            20,
            pageHeight - 10
        );

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
    };

    return (
        <button className="btn btn-primary" onClick={generirajPDF}>
            PDF
        </button>
    );
}
