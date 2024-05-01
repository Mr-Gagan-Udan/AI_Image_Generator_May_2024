import { useEffect, useState } from "react";
const DEFAULT_IMAGE_URL = "https://img.freepik.com/free-psd/3d-rendering-ui-icon_23-2149182289.jpg?size=626&ext=jpg&ga=GA1.1.482985772.1714508851&semt=sph";

const History = () => {
    const [data, setData] = useState([]);

    const getHistory = async () => {
        try{
            const userId = 'default-1';
            const res = await fetch(`http://localhost:1400/api/v1/images/history?userId=${userId}`);
            const arr = await res.json();
            console.log(arr?.data.searches)
            setData(arr?.data?.searches || []);
        }
        catch(err){
            alert(err);
        }
    }

    useEffect(()=>{
        getHistory();
    },[]);

    return(
        <div className="history-card-container">
            {
                data?.map(({_id, cloudinaryUrl, promptText, createdAt})=> {
                    return(
                        <div class="history-card" key={_id}>
                            <h3>{promptText}</h3>
                            <img width='256px' src={cloudinaryUrl || DEFAULT_IMAGE_URL } />
                            <p>{new Date(createdAt).toUTCString()}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default History;