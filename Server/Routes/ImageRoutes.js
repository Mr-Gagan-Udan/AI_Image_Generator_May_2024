import express from "express";
import { getDummyResponse, getImageForQuery, getImageHistory } from "../Controllers/ImageController.js";

const ImageRouter = express.Router();

ImageRouter
    .route('/')
        .get(getDummyResponse)
        .post(getImageForQuery);


ImageRouter
    .route('/history')
        .get(getImageHistory)
export default ImageRouter;
