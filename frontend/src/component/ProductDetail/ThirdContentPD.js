import React, { useEffect, useState } from "react";
import '../landingpages/secondcontent.css'
import { useParams, useHistory } from 'react-router-dom'
import { changeRupiah } from "../../function/priceRupiah";
import { APIrequest } from "../axios/axios";
import "./thirdcontentpd.css";


const PetCardProduct = (props) => {
    const history = useHistory();
    const {item} = props;
    return (
            <div onClick={(e) => {
                e.preventDefault();
                history.push(`/details/${item.product_id}`);
                window.scrollTo({top: 0});
            }} style={{cursor: 'pointer'}} className='popular-pet-container'>
                <img className="petcardmobile" src={item.image_content}></img>
                <div className='details-pet-popular'>
                    <h2>{item.category}</h2>
                    <h3>{item.name}</h3>
                    <h2>{changeRupiah(item.price)}</h2>
                </div>
           </div>
    )
} 

const SecondContent = () => {
    const id = useParams();
    const [listItem, setListItem] = useState([]);
    useEffect(() => {
        APIrequest({
           method: "GET",
           url: "/api/Data/GetProductDetails",
           params : {
                       id : id.id,
                       limit: 4
                    }
        }).then((res) => {
           if (res.status == 200) {
                 setListItem(res.data);
           }
        }).catch((err) => {
           console.log(err.response.data);
        })
     }, [id.id])
  return (
    <div className="secondcontent-main-landing-container">
        <div>
            <h1 className="popularpet-name">Recommended</h1>
        </div>
        <div className="popularpetlist-container" >
            {
                listItem.length == 0 ? null :
                listItem.map(item => <PetCardProduct item={item}/>)
                
            }
            
        </div>
    </div>
  )
}

export default SecondContent