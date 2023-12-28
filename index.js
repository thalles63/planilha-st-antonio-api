const express = require('express');
const app = express();
const cors = require('cors');
const db = require('@cyclic.sh/dynamodb');
const { v4: uuidv4 } = require('uuid');

const fonts = {
	Roboto: {
		normal: './pdf/fonts/Roboto-Regular.ttf',
		bold: './pdf/fonts/Roboto-Medium.ttf',
		italics: './pdf/fonts/Roboto-Italic.ttf',
		bolditalics: './pdf/fonts/Roboto-MediumItalic.ttf'
	}
};

const PdfPrinter = require('./pdf/printer');
const printer = new PdfPrinter(fonts);
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ["http://localhost:4200", "https://st-antonio.vercel.app"]
}

app.use(cors(corsOptions));

const collection = db.collection("clientes");

// Create an item
app.post('/clientes', async (req, res) => {
    const key = uuidv4();
    const item = await collection.set(key, req.body);
    res.send(item);
})

// Update an item
app.put('/clientes/:id', async (req, res) => {
    const key = req.params.id;
    console.log(key)
    await collection.delete(key);
    const item = await collection.set(key, req.body);
    res.send(item);
})

// Delete an item
app.delete('/clientes/:id', async (req, res) => {
    const id = req.params.id;
    const item = await collection.delete(id);
    res.send(item);
})

// Get a single item
app.get('/clientes/:id', async (req, res) => {
    const { props: clientesData } = await collection.get(req.params.id);
    
    res.send(clientesData);
})

// Get a full listing
app.get('/clientes', async (req, res) => {
    const { results: clientesData } = await collection.list();

    const clientes = await Promise.all(
        clientesData.map(async ({ key }) => { 
            const result = (await collection.get(key)).props;
            return { id: key, ...result };
        })
    );

    res.send(clientes);
})

app.get('/clientespdf', async (req, res) => {
    const docDefinition = require("./generate-pdf");
    const { results: clientesData } = await collection.list();
    const clientes = await Promise.all(
        clientesData.map(async ({ key }) => { 
            const result = (await collection.get(key)).props;
            return { id: key, ...result };
        })
    );

    try {
        const pdfDoc = printer.createPdfKitDocument(docDefinition.generatePdfInfo(clientes));
        pdfDoc.pipe(fs.createWriteStream('pdfs/tables.pdf'));
        pdfDoc.end();
    } catch(e) {
        console.log(e)
        // dasdsadsa
    }

    const data = fs.readFileSync('pdfs/tables.pdf');
    res.contentType("application/pdf");
    res.send(data);
})

// Catch all handler for all other request.
app.use('*', (req, res) => {
    res.send({ msg: 'no route handler found' });
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`index.js listening on ${port}`);
})
