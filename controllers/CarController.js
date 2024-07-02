const carService = require("../services/carService");

exports.getAllCars = async (req, res) => {
    try {
        const cars = await carService.getAllCars();
        res.json({ data: cars, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCar = async (req, res) => {
    try {
        const car = await carService.createCar(req.body);
        res.json({ data: car, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await carService.getCarById(req.params.id);
        res.json({ data: car, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const car = await carService.updateCar(req.params.id, req.body);
        res.json({ data: car, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await carService.deleteCar(req.params.id);
        res.json({ data: car, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
