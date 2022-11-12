import React, { useEffect, useState, useContext } from "react";
import './FirstContentPD.css'
import { useParams } from "react-router-dom";
import { APIrequest, getAuthToken } from "../axios/axios";
import { changeRupiah, generateInvoice } from "../../function/priceRupiah";
import { useHistory } from "react-router-dom";
import {UserContext} from '../useContext/userContext';
import Alert from '@mui/material/Alert';

const FirstContentPD = () =>{
   const {user, setUser, order, setOrder} = useContext(UserContext);
   const [alerts, setAlerts] = useState(false);
   const [alertErr, setAlertErr] = useState(false);
   const history = useHistory();
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
   const [count, setCount] = useState(1)
   const [show, setShow] = useState(false)

   const controlMobileBar = () => {
      if (window.scrollY > 400) {
         setShow(true);
      }
      else {
         setShow(false);
      }
   }

   useEffect(() => {
      setCount(1);
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

   useEffect(() => {
      window.addEventListener('scroll', controlMobileBar);
      return (
         () => {
            window.removeEventListener('scroll', controlMobileBar);
         } )
   }, [])
   
   const addcount = () =>{
      if (count+1 <= item.quantity) {
         setCount(count + 1);
      }
      
   }

   const minuscount = () =>{
      if(count > 1){
      setCount(count - 1)
      } 
   }

   const postToCartPD = () => {
      APIrequest({
         method: 'POST',
         url: "/api/Data/PostCart",
         data : {
            fk_product_id : id.id,
            quantity: count,
            fk_user_id : localStorage.getItem("@user"),
            order: localStorage.getItem("@order"),
            no_invoice: generateInvoice(localStorage.getItem("@order")),
            action: "add"
         }
      }).then((res)=> {
         if (res.status == 200) {
            history.push("/checkout");
            
         }
      }).catch((err) => {
            if (!localStorage.getItem("@token")) {
               alert("You Need to Login to Continue");
            }
            else {
               history.push("/checkout");
            }
            
      })
   }
   const postToCart = () => {
      setAlerts(false);
      setAlertErr(false);
      APIrequest({
         method: 'POST',
         url: "/api/Data/PostCart",
         data : {
            fk_product_id : id.id,
            quantity: count,
            fk_user_id : localStorage.getItem("@user"),
            order: localStorage.getItem("@order"),
            no_invoice: generateInvoice(localStorage.getItem("@order")),
            action: "add"
         }
      }).then((res)=> {
         if (res.status == 200) {
            // alert("Product Successfully Added to Your Cart");
            setAlerts(true);
            
         }
      }).catch((err) => {
            if (!getAuthToken()) {
               alert("You Need To Login to Continue");
            }
            else {
               setAlertErr(true);
            }
            
      })
   }

   return (
   <div className="firstcontent-productdetail-main-container">
      <div className="Animal husky2">
         <img src={item.image_content} className="image-product"></img>
         <div onClick={() => {
            history.push("/cart")
         }} className='cart-container-mobile'><i className='but fa fa-shopping-cart'></i></div>
      </div>
      
      <div className="Product-biling">
         <h2 className="animal-title">{item.name}</h2>
         <div className="Detail-description-product">
            
          
            <h2 className="animal-price">{changeRupiah(item.price)}</h2>
        
            
         </div>
         <div className={`mobile-quantity ${show && "mobilequnav"}`}>
            <div className="quantity-mobile-container">
               <h2>Pilih Jumlah</h2>
               <div className="buttonplusminus-mobile-quantity">
                  <button className="butsm minusmobile-button" onClick={minuscount}>-</button>
                  <h2 style={{color: "#F99941"}}>{count}</h2>
                  <button className="butsm plusmobile-button" onClick={addcount}>+</button>
               </div>
            </div>
            <div className="price-mobile-container">
               <h2>Total</h2>
               <h2>{changeRupiah(item.price*count)}</h2>
            </div>
            <div className="button-mobile-container-addcartbynow">
               <div onClick={() => {
                  postToCart();
               }} className="button-mobile-addcart">Add to Cart</div>
               <div onClick={(e) => {
                    e.preventDefault();
                    postToCartPD();
                }} className="button-mobile-bynows">Buy Now</div>
            </div>
         </div>
         
         <div className="Detail-quantity-product">
            <div className="quantity">
               <h2>Quantity</h2>
               <div className="add-quantity">
                     <button className="minus" onClick={minuscount}>-</button>
                     <h2 style={{color: "#F99941"}}>{count}</h2>
                     <button className="plus" onClick={addcount}>+</button>
               </div> 
            </div>
            <div className="subtotal">
               <h2>subtotal</h2>
               <h2>{changeRupiah(item.price*count)}</h2>
               
            </div>
               
            <div className="button-quantity">
               <button onClick={(e) => {
                  e.preventDefault();
                  postToCart();
               }} className="button-add-to-cart textadd">Add to Cart</button>
               <button onClick={(e) => {
                    e.preventDefault();
                    postToCartPD();

                }} className="button-buy-now textbuy">Buy Now</button>
            </div>
               {
                  alerts? <Alert sx={{marginTop: "20px"}}severity="success">Product Successfully Added to Your Cart</Alert> : null
               }
               {
                  alertErr? <Alert sx={{marginTop: "20px"}}severity="error">Product Already Exist in Your Cart</Alert> : null
               }
         </div>
      </div>
   </div>
   )
}

export default FirstContentPD