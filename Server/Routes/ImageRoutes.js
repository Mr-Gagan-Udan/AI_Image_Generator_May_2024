import express from "express";
import { getDummyResponse, getImageForQuery, getImageHistory, verifySecretKey } from "../Controllers/ImageController.js";

const ImageRouter = express.Router();

ImageRouter
    .route('/')
        .get(getDummyResponse)
        .post(getImageForQuery);


ImageRouter
    .route('/history')
        .get(getImageHistory)

ImageRouter
    .route('/validSecret')
        .post(verifySecretKey)

export default ImageRouter;
