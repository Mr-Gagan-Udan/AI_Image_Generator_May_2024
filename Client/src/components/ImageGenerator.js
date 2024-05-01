import { useState } from "react";
import 'dotenv/config';

const ImageGenerator = () => {
    const [searchText, setSearchText] = useState('');
    const [imageUrl, setImageUrl] = useState(process.env.DEFAULT_IMAGE_URL);
    const [loading, setLoading] = useState(false);

    const textChanged = (e) => {
        setSearchText(e.target.value);
    }

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
        try{
            setLoading(true);
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/images`, {
                method: "POST",
                body: JSON.stringify({
                userId: "default-1",
                searchText: searchText,
                secretKey: process.env.BACKEND_CONNECTIONS_SECRET_KEY,
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
                alert(data?.message?.title);
                alert(data?.message?.text);
            }
            else{
                setImageUrl(data.data.image);
            }
            setLoading(false);
        }
        catch(err){
            setLoading(false);
            alert("Something went wrong...");
        }
    }

    return(
        <div className="image-generator-container">
            <h1>Try our latest AI Image Generator for free!</h1>
            <div className="img-container">
                <img src={imageUrl} />
                <div className={loading ? 'loader loader-on' : 'loader'} />
            </div>
            <div className='search-container'>
                <input value={searchText} onChange={(e)=>{textChanged(e)}}/>
                <button onClick={getNewImage}>Generate</button> 
            </div>
            {
                imageUrl !== process.env.DEFAULT_IMAGE_URL &&
                <button class='download-btn' onClick={()=>downloadImage()}>Download</button>
            }
        </div>
    )
}

export default ImageGenerator;