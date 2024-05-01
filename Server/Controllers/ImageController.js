import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary'
import ImageModel from '../Schema/imageSchema.js';
import 'dotenv/config';

const openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

export const getDummyResponse = (req, res)=>{
    res.send('Our route is working!')
}

const uploadToCloudinary = async (image) => {
    try{
        const cloudinaryRes = await cloudinary.uploader.upload(image, {
            folder: process.env.CLOUDINARY_IMAGES_FOLDER,
        })
        return cloudinaryRes;
    }
    catch(err){
        console.log('Cloudinary error:\n', err);
        return {};
    }
}

const uploadToMongoDB = ({image, searchText, cloudinaryRes, userId}) => {
    try{
        ImageModel.create({
            promptText: searchText,
            originalUrl: image,
            cloudinaryUrl: cloudinaryRes.url,
            userId: userId,
            asset_id: cloudinaryRes.asset_id,
            public_id: cloudinaryRes.public_id,
            version_id: cloudinaryRes.version_id,
        });
    }
    catch(err){
        console.log('MongoDB error:\n', err);
    }
}

export const getImageForQuery = async (req, res) => {
    try{
        console.log(req.body);
        const {searchText, size, userId} = req.body;
    
        const data = await openAi.images.generate({
            model: "dall-e-2",
            prompt: searchText,
            n: 1,
            size: size,
        });
    
        const image = data.data[0].url;

        const cloudinaryRes = await uploadToCloudinary(image);
        uploadToMongoDB({
            image, searchText, cloudinaryRes, userId
        });
    
        res.status(200).json({
            status: 'success',
            data:{
                image: image,
                cloudinaryUrl: cloudinaryRes.url || null,
            }
        });
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            message: {
                title: err?.code,
                text: err?.message
            }
        });
    }
}

export const getImageHistory = async (req, res) => {
    const searches = await ImageModel.find({userId: req.query.userId});
    res.status(200).json({
        status: 'success',
        data:{
            searches: searches,
        }
    })
}