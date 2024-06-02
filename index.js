const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ["http://localhost:4200", "https://st-antonio.vercel.app"]
}

app.use(cors(corsOptions));

db.connectToDb();

const pedidoRouter = require("./routes/PedidoRoutes");
const pdfRouter = require("./routes/PdfRoutes");
app.use("/api/clientes", pedidoRouter);
app.use("/api/pdf", pdfRouter);


// Catch all handler for all other request.
app.use('*', (req, res) => {
    res.send({ msg: 'no route handler found' });
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`index.js listening on ${port}`);
})
