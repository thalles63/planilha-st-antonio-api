const pedidoService = require("../services/pedidoService");
const PdfPrinter = require('../pdf/printer');
const docDefinition = require("../generate-pdf");

const fonts = {
    Roboto: {
        normal: './pdf/fonts/Roboto-Regular.ttf',
        bold: './pdf/fonts/Roboto-Medium.ttf',
        italics: './pdf/fonts/Roboto-Italic.ttf',
        bolditalics: './pdf/fonts/Roboto-MediumItalic.ttf'
    }
};
const printer = new PdfPrinter(fonts);

exports.getAllPedidos = async (req, res) => {
    try {
        const pedidos = filterClients(await pedidoService.getAllPedidos(), req.query.pastClients);
        res.json({ data: pedidos, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPedido = async (req, res) => {
    try {
        const pedido = await pedidoService.createPedido(req.body);
        res.json({ data: pedido, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPedidoById = async (req, res) => {
    try {
        const pedido = await pedidoService.getPedidoById(req.params.id);
        res.json({ data: pedido, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePedido = async (req, res) => {
    try {
        const pedido = await pedidoService.updatePedido(req.params.id, req.body);
        res.json({ data: pedido, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePedido = async (req, res) => {
    try {
        const pedido = await pedidoService.deletePedido(req.params.id);
        res.json({ data: pedido, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPedidosPdf = async (req, res) => {
    try {
        const pedidos = await pedidoService.getAllPedidos();
        let pdfDoc;
        let chunks = [];
        let result;

        const filteredClientes = filterClients(pedidos, req.query.pastClients);

        try {
            pdfDoc = printer.createPdfKitDocument(docDefinition.generatePdfInfo(filteredClientes, req.query.pastClients));
        } catch (e) {
            console.log(e)
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

function filterClients(clientes, pastClients) {
    if (pastClients === "true") {
        return clientes;
    }

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: 'America/Sao_Paulo' }));
    now.setHours(0, 0, 0, 0);

    let clientesFiltrados = clientes.filter((cliente) => {
        const dataEntrega = new Date(cliente.dataEntrega + 'T00:00:00.000-03:00');
        return dataEntrega >= now
    })

    return clientesFiltrados;
}
