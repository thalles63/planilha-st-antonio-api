const express = require("express");
const {
  getAllPedidos,
  createPedido,
  getPedidoById,
  updatePedido,
  deletePedido
} = require("../controllers/PedidoController");
 
const router = express.Router();
 
router.route("/").get(getAllPedidos).post(createPedido);
router.route("/:id").get(getPedidoById).put(updatePedido).delete(deletePedido);
 
module.exports = router;