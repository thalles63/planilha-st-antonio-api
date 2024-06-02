const express = require("express");
const { getPedidosPdf } = require("../controllers/PedidoController");
 
const router = express.Router();
 
router.route("/clientes").get(getPedidosPdf);
 
module.exports = router;