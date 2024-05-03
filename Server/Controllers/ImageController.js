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

        if(!secret || secret.remainingCounts<=0 || frontendSecretKey!=process.env.BACKEND_CONNECTIONS_SECRET_KEY){
            return res.status(401).json({
                status: 'fail',
                message: {
                    title: 'Unauthorized request !',
                    text: 'Secret key is not valid !',
                },
            })
        }

        // const data = await openAi.images.generate({
        //     model: "dall-e-2",
        //     prompt: searchText,
        //     n: 1,
        //     size: size,
        // });
        // const image = data.data[0].url;


        // const deepAIResp = await fetch('https://api.deepai.org/api/text2img', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'api-key': 'YOUR_API_KEY'
        //     },
        //     body: JSON.stringify({
        //         text: "YOUR_TEXT_URL",
        //     })
        // });
        // const data = await deepAIResp.json();
        // console.log("data:", data)

        const imageRes = await fetch("https://api.hotpot.ai/art-maker-sdte-zmjbcrr", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "api-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTQ3Mzk3NzAsImV4cCI6MTcxNDgyNjE3MH0.0lUm-GRELcpj7jGU0brLwpI4gLWsVLYHHQBEpYAa7Ac",
                "authorization": "hotpot-t2mJbCr8292aQzp8CnEPaK",
                "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryC0z7dOlgSmpbPXfW",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://hotpot.ai/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": `------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"seedValue\"\r\n\r\nnull\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"inputText\"\r\n\r\n${searchText}\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"width\"\r\n\r\n512\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"height\"\r\n\r\n512\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"styleId\"\r\n\r\n77\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"styleLabel\"\r\n\r\nConcept Art 3\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"isPrivate\"\r\n\r\nfalse\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"price\"\r\n\r\n0\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"requestId\"\r\n\r\n8-Tk8kcIoLsWipIvq\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW\r\nContent-Disposition: form-data; name=\"resultUrl\"\r\n\r\nhttps://hotpotmedia.s3.us-east-2.amazonaws.com/8-Tk8kcIoLsWipIvq.png\r\n------WebKitFormBoundaryC0z7dOlgSmpbPXfW--\r\n`,
            "method": "POST"
        });

        const image = await imageRes.json();

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