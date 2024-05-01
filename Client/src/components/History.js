import { useEffect, useState } from "react";
import 'dotenv/config';

const History = () => {
    const [data, setData] = useState([]);

    const getHistory = async () => {
        try{
            const userId = 'default-1';
            const res = await fetch(`${process.env.BACKEND_URL}/api/v1/images/history?userId=${userId}`);
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
                            <img width='256px' src={cloudinaryUrl || process.env.DEFAULT_IMAGE_URL } />
                            <p>{new Date(createdAt).toUTCString()}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default History;