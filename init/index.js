const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust" ;

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDb = async () => {
    await Listing.deleteMany({}) ;
    initdata.data = initdata.data.map((obj) => ({...obj, owner : "6726e9ee96c2aed9853fc98a"}));
    await Listing.insertMany(initdata.data);
    console.log("data was intialize");
}

initDb();