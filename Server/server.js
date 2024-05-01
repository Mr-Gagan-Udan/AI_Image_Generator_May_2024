import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose";
import 'dotenv/config';
import app from './app.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const mongoURL = process.env.MONGODB_URL
                    .replace('<USERNAME>',process.env.MONGODB_USERNAME)
                    .replace('<PASSWORD>',process.env.MONGODB_PASSWORD)
                    .replace('<DATABASE_NAME>',process.env.MONGODB_DATABASE_NAME)

mongoose.connect(mongoURL).then(()=>{
    console.log('-----------Database Connected! ------------')
})

app.listen(1400, () => {
    console.log('******** Server Started on port 1400 ********')
})