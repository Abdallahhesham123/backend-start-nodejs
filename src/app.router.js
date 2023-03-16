import authRouter from './modules/auth/auth.router.js';
import userRouter from './modules/user/user.router.js'
import productRouter from './modules/product/product.router.js';
import mongoose from 'mongoose';
import connectionDb from '../DB/connection.js';
import { globalErrorHandler } from './utils/errorHandling.js';
import path from "path";
import { fileURLToPath } from 'url';


const initApp = (app, express) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // app.use(bodyParser.json());
 
    //for image
    app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
//connectDb

    app.use(express.json({}))
    mongoose.set('strictQuery', false)
    connectionDb()
    app.get('/', (req, res) => res.send('Hello World!'))

    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/product', productRouter)


    app.use("*" , (req,res)=>{
        return res.json({message:"404 Page Not Found"})
    })
    app.use(globalErrorHandler)

}


export default initApp