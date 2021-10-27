const mongoose = require("mongoose")

const schema = mongoose.Schema({
    _id:String, 
	key: String,
    active: Boolean,
    group: String,
    details: String,
    title: String,
    has_outrights: String, 
})

module.exports = mongoose.model("Sport", schema)