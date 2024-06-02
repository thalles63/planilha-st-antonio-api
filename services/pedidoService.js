const PedidoModel = require("../models/Pedido");
 
exports.getAllPedidos = async () => {
  return await PedidoModel.find();
};
 
exports.createPedido = async (pedido) => {
  return await PedidoModel.create(pedido);
};

exports.getPedidoById = async (id) => {
  return await PedidoModel.findById(id);
};
 
exports.updatePedido = async (id, pedido) => {
  return await PedidoModel.findByIdAndUpdate(id, pedido);
};
 
exports.deletePedido = async (id) => {
  return await PedidoModel.findByIdAndDelete(id);
};