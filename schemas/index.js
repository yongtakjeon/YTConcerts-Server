const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI,
        {},
        (error) => {
            if (error) {
                console.log('DB connection failed');
            }
            else {
                console.log('DB conncetion success');
            }
        });
};

mongoose.connection.on('error', (error) => {
    console.log('MongoDB connection error', error);
});

mongoose.connection.on('disconnected', () => {
    console.log("MongoDB disconnected. Trying to reconnect...");
    connectDB();
});

module.exports = connectDB;