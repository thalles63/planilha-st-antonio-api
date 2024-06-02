const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    id: String,
    dataEntrega: String,
    cliente: String,
    quantidade: String,
    observacao: String
});

module.exports = mongoose.model("Pedido", pedidoSchema);