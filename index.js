const express = require('express');
const app = express();
const cors = require('cors');
const db = require('@cyclic.sh/dynamodb');
const { v4: uuidv4 } = require('uuid');
;
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

// Catch all handler for all other request.
app.use('*', (req, res) => {
    res.send({ msg: 'no route handler found' });
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`index.js listening on ${port}`);
})
