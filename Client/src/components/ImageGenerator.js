import { useEffect, useState } from "react";
import { FaSearchengin } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";

import 'dotenv/config';
import ErrorPopUp from "./common/ErrorPopUp";

const ImageGenerator = () => {
    const [searchText, setSearchText] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [authorization, setAuthorization] = useState({allowed: false});
    const [imageUrl, setImageUrl] = useState(process.env.DEFAULT_IMAGE_URL);
    const [loading, setLoading] = useState(false);

    const downloadImage = (src=imageUrl) => {
        console.log(src);
        const img = new Image();
        img.crossOrigin = 'anonymous';  // This tells the browser to request cross-origin access when trying to download the image data.
        // ref: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#Implementing_the_save_feature
        img.src = src;
        img.onload = () => {
            // create Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            // create a tag
            const a = document.createElement('a');
            a.download = 'download.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
        };
    }

    const getNewImage = async() => {
        if(!searchText){
            return alert('Input is empty!');
        }

        try{
            setLoading(true);
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/images`, {
                method: "POST",
                body: JSON.stringify({
                userId: "default-1",
                searchText: searchText,
                userSecretKey: secretKey,
                frontendSecretKey: process.env.BACKEND_CONNECTIONS_SECRET_KEY,
                size: '256x256'
                }),
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            });
            const data = await res.json();
            console.log(data);
            // imageUrl = data.data.image;
            if(data.status == 'fail'){
                ErrorPopUp(data);
            }
            else{
                setImageUrl(data.data.image);
                setAuthorization((prev)=>({
                    ...prev,
                    remainingCounts: prev.remainingCounts-1,
                }));
            }
            setLoading(false);
        }
        catch(err){
            setLoading(false);
            alert("Something went wrong...");
        }
    }

    const checkIfValidSecretKey = async () => {
        if(!secretKey){
            return alert('Input is empty!');
        }
        try{
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/images/validSecret`, {
                method: "POST",
                body: JSON.stringify({
                    secretKey: secretKey,
                }),
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            });
            const data = await res.json();
            console.log(data);
            if(data.status==='fail'){
                ErrorPopUp(data);
            }
            else{
                setAuthorization({
                    allowed: true,
                    allowedCounts: data.data.allowedCounts,
                    remainingCounts: data.data.remainingCounts,
                });
            }
        }
        catch(err){
            alert('Something went wrong...');
        }
    }

    useEffect(()=>{
        if(authorization.remainingCounts<=0){
            window.location.reload();
        }
    },[authorization])

    return(
        <div className="image-generator-container">
            <h1>Try our latest AI Image Generator for free!</h1>
            <div className="img-container">
                <img src={imageUrl} />
                <div className={loading ? 'loader loader-on' : 'loader'} />
            </div>
            <div className='search-container'>
                <input disabled={!authorization.allowed} placeholder='Prompt text here...' value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}/>
                <button disabled={!authorization.allowed} className={authorization.allowed?'':'btn-disabled'} onClick={getNewImage}><FaSearchengin/></button> 
            </div>
            {
                authorization.allowed ?
                (
                        <p className='remaining-counts'>Remaining Trials: <strong>{authorization.remainingCounts}</strong> / {authorization.allowedCounts}</p>
                )
                :
                (
                    <div className='search-secret-key-container'>
                        <input placeholder='Enter your Secret Key...' value={secretKey} className='search-secret-key' onChange={(e)=>{setSecretKey(e.target.value)}}/>
                        <button onClick={checkIfValidSecretKey}><MdOutlineDone /></button>
                    </div>
                )
            }
            {
                imageUrl !== process.env.DEFAULT_IMAGE_URL &&
                <button className='download-btn' onClick={()=>downloadImage()}>Download</button>
            }
        </div>
    )
}

export default ImageGenerator;