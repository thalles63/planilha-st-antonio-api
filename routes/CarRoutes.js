const express = require("express");
const {
  getAllCars,
  createCar,
  getCarById,
  updateCar,
  deleteCar
} = require("../controllers/CarController");
 
const router = express.Router();
 
router.route("/").get(getAllCars).post(createCar);
router.route("/:id").get(getCarById).put(updateCar).delete(deleteCar);
 
module.exports = router;