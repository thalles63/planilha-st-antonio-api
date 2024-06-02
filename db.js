const mongoose = require("mongoose");

const username = encodeURIComponent(process.env.DBUSER);
const password = encodeURIComponent(process.env.DBPASSWORD);
const connectionString = `mongodb+srv://${username}:${password}@stantonio.i9a3xsx.mongodb.net/?retryWrites=true&w=majority&appName=stantonio`;

module.exports = {
    connectToDb: () => {
        const conn = mongoose.connect(
            connectionString
        )

        return conn;
    } 
};

