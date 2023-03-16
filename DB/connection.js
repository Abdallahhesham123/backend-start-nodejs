import mongoose from 'mongoose';
import dotenv from "dotenv";
const connectionDb=async()=>{
  dotenv.config();
  return await mongoose.connect(process.env.URL_DB).then((result)=>{
    console.log('Connected to database Successfully')
}).catch((error)=>{

    console.log('Error database',error)
});
}

export default connectionDb