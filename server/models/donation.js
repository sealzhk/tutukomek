const mongoose = require('mongoose')

const Schema = mongoose.Schema
const donationSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId, ref: 'user'
    },
    fundraisingid: {
        type: Schema.Types.ObjectId, ref: 'fundraising'
    },
    comment: { type: String, default: ""},
    total: Number,
    donation: Number,
    tip: Number,
    card_num: String,
    expiry: String,
    cvv: String,
    email: String,
    currency: { type: String, default: "Tenge"},
    date: { type: Date, default: Date.now },
})
module.exports = mongoose.model('donation', donationSchema, 'donations')