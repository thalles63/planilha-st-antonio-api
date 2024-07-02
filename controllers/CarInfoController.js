const carService = require("../services/carService");

exports.getBrands = async (req, res) => {
    try {
        const cars = await carService.getAllCars();
        const brands = cars.map((car) => car.brand);
    
        res.json({ data: [...new Set(brands)], status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getModels = async (req, res) => {
    try {
        const cars = await carService.getAllCars();
        const models = cars.map((car) => car.model);

        res.json({ data: [...new Set(models)], status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCities = async (req, res) => {
    try {
        const cars = await carService.getAllCars();
        const cities = cars.map((car) => car.city);

        res.json({ data: [...new Set(cities)], status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};