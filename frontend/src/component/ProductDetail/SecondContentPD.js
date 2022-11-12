import React, {useState, useEffect} from "react";
import './SecondContentPD.css';
import { useParams } from "react-router-dom";
import { APIrequest } from "../axios/axios";

const SecondContentPD = () =>{
    const id = useParams();
    const [item, setItem] = useState({
        product_id: 0,
        name: "",
        category: "",
        desc: "",
        image_content: "",
        quantity: 0,
        price: 0,
        keywords: "",
        action_type: ""
   });
   useEffect(() => {
        APIrequest({
        method: "GET",
        url: "/api/Data/GetProductDetails",
        params : {
                    id : id.id
                    }
        }).then((res) => {
        if (res.status == 200) {
                setItem(res.data[0]);
        }
        }).catch((err) => {
        console.log(err.response.data);
        })
    }, [id.id])
  return (
    <div className="secondcontentpd-main-container">
        <div className="Line">
        </div>
        <div className="Detail-PD">
            <h3>Detail</h3>
        </div>
        <div className="Category-PD">
            <div className="Category-PD-Category">
                <p>Category :</p>
            </div>
            <div className="Category-PD-Animal">
                <h3>{item.category}</h3>
            </div>
        </div>
        <div className="Paragraph-PD">
            <p>{item.desc}</p>
        </div>
        <div className="Line2">
        </div>
    </div>
  )
}

export default SecondContentPD