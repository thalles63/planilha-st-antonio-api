const express = require("express");
const {
  getBrands,
  getModels,
  getCities
} = require("../controllers/CarInfoController");
 
const router = express.Router();
 
router.route("/brands").get(getBrands);
router.route("/models").get(getModels);
router.route("/cities").get(getCities);
 
module.exports = router;