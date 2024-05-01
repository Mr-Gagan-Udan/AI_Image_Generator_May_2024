// const express = require("express");
import express from "express";
import cors from 'cors';
import ImageRouter from "./Routes/ImageRoutes.js";


const app = express();

app.use(cors({origin: true}));

app.use((req, res, next)=>{
    console.log(req.method, req.url);
    next();
})

app.use(express.json());

app.use('/api/v1/images', ImageRouter);

export default app;