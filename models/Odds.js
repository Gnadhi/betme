// I.e fixture info
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  _id: String,
  id: String,
  sport_key: String,
  sport_nice: String,
  teams: [String],
  commence_time: Number, // Unix time
  house_team: String,
  sites: [
    {
      site_key: String,
      site_nice: String,
      last_update: Number,
      odds: {
        h2h: [Number],
      },
    },
  ],
  site_count: Number,
});

module.exports = mongoose.model("Odds", schema);
