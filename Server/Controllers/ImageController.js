import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary'
import ImageModel from '../Schema/imageSchema.js';
import 'dotenv/config';
import SecretKeyModel from '../Schema/secretKeysSchema.js';

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

const useSecretKeyForQuery = async (secret) => {
    await SecretKeyModel.findByIdAndUpdate(secret._id, {
        remainingCounts: secret.remainingCounts - 1,
    });
}

export const verifySecretKey = async (req, res) => {
    const [secret] = await SecretKeyModel.find({secretKey: req.body.secretKey});
    if(!secret){
        res.status(401).json({
            status: 'fail',
            message: {
                title: 'Invalid secret key',
                text: 'Please contact admin to get a new secret key',
            }
        });
    }
    else if(secret.remainingCounts<=0){
        res.status(401).json({
            status: 'fail',
            message: {
                title: 'Secret key usage limit exceeded',
                text: 'Please contact admin to get a new secret key',
            }
        });
    }
    else{
        res.status(200).json({
            status: 'success',
            data:{
                allowedCounts: secret.allowedCounts,
                remainingCounts: secret.remainingCounts,
            }
        });
        return secret;
    }
    return null;
}

export const getImageForQuery = async (req, res) => {
    try{
        console.log(req.body);
        const {searchText, size, userId, userSecretKey, frontendSecretKey} = req.body;

        const [secret] = await SecretKeyModel.find({secretKey: userSecretKey});

        console.log("\n✅ : secret:", secret)


        if(!secret || secret.remainingCounts<=0 || frontendSecretKey!=process.env.BACKEND_CONNECTIONS_SECRET_KEY){
            return res.status(401).json({
                status: 'fail',
                message: {
                    title: 'Unauthorized request !',
                    text: 'Secret key is not valid !',
                },
            })
        }

        const data = await openAi.images.generate({
            model: "dall-e-2",
            prompt: searchText,
            n: 1,
            size: size,
        });
    
        const image = data.data[0].url;

        const cloudinaryRes = await uploadToCloudinary(image);
        uploadToMongoDB({image, searchText, cloudinaryRes, userId});
        useSecretKeyForQuery(secret);
    
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
    const searches = await ImageModel
                            .find({userId: req.query.userId})
                            .sort('-createdAt');
    res.status(200).json({
        status: 'success',
        data:{
            searches: searches,
        }
    })
}