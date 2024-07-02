const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    id: String,
    editionId: String,
    ticket: Number,
    name: String,
    brand: String,
    model: String,
    year: Number,
    phone: Number,
    licensePlate: String,
    city: String,
    club: String
});

module.exports = mongoose.model("Car", carSchema);