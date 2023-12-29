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
    const onlyPresent = req.query.onlyPresent === 'true';
    const { results: clientesData } = await collection.list();

    const clientes = await Promise.all(
        clientesData.map(async ({ key }) => { 
            const result = (await collection.get(key)).props;
            return { id: key, ...result };
        })
    );

    const filteredClientes = filterClients(clientes, onlyPresent);

    res.send(filteredClientes);
})

app.get('/clientespdf', async (req, res) => {
    const onlyPresent = req.query.onlyPresent === 'true';
    const docDefinition = require("./generate-pdf");
    const { results: clientesData } = await collection.list();
    const clientes = await Promise.all(
        clientesData.map(async ({ key }) => { 
            const result = (await collection.get(key)).props;
            return { id: key, ...result };
        })
    );

    let pdfDoc;
    let chunks = [];
    let result;

    const filteredClientes = filterClients(clientes, onlyPresent);

    try {
        pdfDoc = printer.createPdfKitDocument(docDefinition.generatePdfInfo(filteredClientes, onlyPresent));
    } catch(e) {
        console.log(e)
        // dasdsadsa
    }

    pdfDoc.on('data', function (chunk) {
        chunks.push(chunk)
    });

    pdfDoc.on('end', function () {
        result = Buffer.concat(chunks)

        res.contentType('application/pdf')
        res.send(result)
    });

    pdfDoc.end();
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

function filterClients(clientes, onlyPresent) {
    if (!onlyPresent) {
        return clientes;
    }

    const now = new Date(new Date().toLocaleString("en-US", {timeZone: 'America/Sao_Paulo'}));
    now.setHours(0,0,0,0);

    let clientesFiltrados = clientes.filter((cliente) => {
        const dataEntrega = new Date(cliente.dataEntrega + 'T00:00:00.000-03:00');
        return dataEntrega >= now
    })

    return clientesFiltrados;
}