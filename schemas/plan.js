const mongoose = require('mongoose');
const { Schema } = mongoose;

const planSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    concertId: {
        type: String,
        required: true
    }
});

// to avoid saving same concert for the same user
planSchema.index({ userId: 1, concertId: 1 }, { unique: true });

module.exports = mongoose.model('plans', planSchema);