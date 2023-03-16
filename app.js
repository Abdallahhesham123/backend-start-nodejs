
import express from 'express';

import dotenv from 'dotenv'
dotenv.config()

import initApp from './src/app.router.js';
const app = express()

const port = process.env.PORT || 5000

console.log({DB: process.env.URL_DB});
initApp(app, express)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))