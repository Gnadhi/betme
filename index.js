require("dotenv").config();

const mongoose = require("mongoose");
const Sport = require("./models/Sport");
const axios = require("axios");
const cron = require("node-cron");
const Odds = require("./models/Odds");

// Functions to populate database with the sports
async function grab_sports() {
  var config = {
    method: "get",
    url: `https://api.the-odds-api.com/v3/sports/?apiKey=${process.env.API_KEY}&all=true`,
    headers: {},
  };

  axios(config)
    .then(async function (response) {
      response.data.data.forEach(async function (msg) {
        //console.log(msg)
        const doesSportExist = await Sport.exists({ _id: msg.key });
        if (!doesSportExist) {
          const sport = new Sport({ _id: msg.key, ...msg });
          await sport.save();
        }
      });
    })

    .catch(function (error) {
      console.log(error);
    });
}

// Function to populate with odds/fixtures
// Functions to populate database
async function grab_odds() {
  var config = {
    method: "get",
    url: `https://api.the-odds-api.com/v3/odds/?sport=upcoming&region=uk&mkt=h2h&apiKey=${process.env.API_KEY}`,
    headers: {},
  };

  axios(config)
    .then(async function (response) {
      response.data.data.forEach(async function (msg) {
        // console.log(msg)

        const doesOddsExist = await Odds.exists({ _id: msg.id });
        if (!doesOddsExist) {
          const odds = new Odds({ _id: msg.id, ...msg });
          await odds.save();
          return;
        }

        //if this odds already exists lets update it
        await Odds.updateOne({_id: msg.id}, {...msg});
        
      });
    })

    .catch(function (error) {
      console.log(error);
    });
}

mongoose
  .connect(process.env.DB_CONNECTION_URI, { useNewUrlParser: true })
  .then(() => {
    // On Start Up we'll run the following
    // Grab all the sports and store in the database
    grab_sports();
    // Grab all the upcoming fixtures and store in the database
    grab_odds();

    // Grab the odds of matches not in play ever hour and store in database
    cron.schedule("* 0-23 * * * *", () => {
      console.log("will update every hour");
	  grab_odds(); 
    });

  });
