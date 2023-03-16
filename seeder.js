const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const itemModel = require("./models/itemModel");
const items = require("./utility/data");
// eslint-disable-next-line import/no-extraneous-dependencies
require("colors");
//config
dotenv.config();
connectDb();

//function seeder
const importData = async () => {
  try {
    await itemModel.deleteMany();
    const itemsData = await itemModel.insertMany(items);
    console.log("All Items Added".bgGreen);
    process.exit();
  } catch (error) {
    console.log(`${error}`.bgRed.inverse);
    process.exit(1);
  }
};

importData();
