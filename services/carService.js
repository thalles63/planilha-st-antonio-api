const CarModel = require("../models/Car");
 
exports.getAllCars = async () => {
  return await CarModel.find();
};
 
exports.createCar = async (car) => {
  return await CarModel.create(car);
};

exports.getCarById = async (id) => {
  return await CarModel.findById(id);
};
 
exports.updateCar = async (id, car) => {
  return await CarModel.findByIdAndUpdate(id, car);
};
 
exports.deleteCar = async (id) => {
  return await CarModel.findByIdAndDelete(id);
};