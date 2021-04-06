const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://lucvduarte:lucvduarte@microempreendimento.xy2zr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error ao iniciar bd`);
        console.log(`Error: ${error}`);
        process.exit(1);
    }
}

module.exports = connectDB;