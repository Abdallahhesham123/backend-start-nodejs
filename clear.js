import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDb from "./DB/connection.js" ;
import  itemModel from "./DB/model/Item.model.js";
import  items from "./src/utils/clear.js";
// eslint-disable-next-line import/no-extraneous-dependencies
import colors from "colors";
//config
dotenv.config();
connectDb();

//function seeder
const importData = async () => {
  try {
    await itemModel.deleteMany();
    const itemsData = await itemModel.insertMany(items);
    console.log("All Items Removed".bgGreen);
    process.exit();
  } catch (error) {
    console.log(`${error}`.bgRed.inverse);
    process.exit(1);
  }
};

importData();
