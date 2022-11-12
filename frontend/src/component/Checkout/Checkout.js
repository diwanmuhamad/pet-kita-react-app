import React, { useState, useEffect } from "react";
import './Checkout.css'
import {Dialog} from '@mui/material'
import { Link } from "react-router-dom";
import { APIrequest } from "../axios/axios";
import { changeRupiah, generateInvoice } from "../../function/priceRupiah";
import { useLocation } from "react-router-dom";



const ListCheckOut = (props) => {
    const {item} = props;
    return (
        <div className="list-detail">
                <h3 className="list-name">{item.no}. {item.name}</h3>
                <h3 className="list-quantity">{changeRupiah(item.price)} x{item.quantity}</h3>
         </div>
    )
}

const Cout = () =>{
    const location = useLocation();
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
    const [payment, setPayment] = useState("Cash");
    
    if (location.state == undefined) {
        location.state = {
            price: 0,
            quantity: 0
        }
    }
    const [listCheck, setListCheck] = useState([]);
    const [open, setOpen] = useState(false)

    const ClickToOpen = () => {
        setOpen(true);
    };
  
    const ClickToClose = () => {
        setOpen(false);
    };

    const totalQuantity = (list) => {
        let result = 0;
        list.forEach(element => {
            result += element.quantity;
        });
        return result;
    }

    const totalPrice = (list) => {
        let result = 0;
        list.forEach(element => {
            result += element.price * element.quantity;
        });
        return result;
    }

    const dateNow = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let dates = date.getDate();
        if (month + 1 > 12) {
            month = 1;
        }
        else {
            month += 1;
        }

        return year.toString() + "-" + month.toString() + "-" + dates.toString();
    }


    const postInvoice = () => {
        APIrequest({
            method: "POST",
            url: "/api/Data/PostInvoice",
            data: {
                order_invoice: localStorage.getItem("@order"),
                fk_user_id: localStorage.getItem("@user"),
                no_invoice: generateInvoice(localStorage.getItem("@order")),
                buy_date: dateNow(),
                total_product: quantity,
                total_price: price,
                address: address,
                number: number,
                payment: payment
            }
        }).then((res)=> {
            APIrequest({
                method: "GET",
                url: "/api/Data/GetOrder",
                params: {
                    user_id: localStorage.getItem("@user")
                }
            }).then((res) => {
                if (res.status == 200) {
                    localStorage.setItem("@order", res.data + 1);
                }
            }).catch((err) => {
                console.log(err.response.data);
            })
            listCheck.forEach(item => {
                APIrequest({
                    method: "POST",
                    url: "api/data/UpdateQuantity",
                    params : {
                        product_id: item.product_id,
                        quantity: item.quantity,
                    }
        
                }).then().catch((err) => console.log(err.response.data))
            });
        }
        ).catch((err) => console.log(err.response.data))

        
    }

    useEffect(() => {
        console.log(dateNow());
        APIrequest({
            method: "GET", 
            url: "/api/data/GetCart",
            params : {
                user_id : localStorage.getItem("@user"),
                order : localStorage.getItem("@order")
            } 
        }).then((res) => {
            if (res.status == 200) {
                setPrice(totalPrice(res.data));
                setQuantity(totalQuantity(res.data));
                setListCheck(res.data);
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
    },[]);
   return( 
   <div className="container-chekcout">
        <div className="checkout-container">
            <h1>Checkout</h1>
        </div>
        <div>
            <div className="address-container">
                <div className="title-format">
                    <h2 className="title-margin">Alamat Pengiriman</h2>
                    <h2 className="telephone-margin">Nomor Telephone</h2>
                </div>
                <div className="input-container">
                    <textarea onChange={(e) => setAddress(e.target.value)} className="address-input"></textarea>
                    <input onChange={(e) => setNumber(e.target.value)} className="number-input"></input>
                </div>
            </div>
            <div className="list-container">
                <div className="title-format">
                    <h2 className="title-margin">Product List</h2>
                </div>
                <div className="list">
                    {
                        listCheck.length == 0 ? null :
                        listCheck.map(item => {
                            return <ListCheckOut item={item} />
                        })
                    }
                    
                </div>
            </div>
            <div className="shopping-price">
                <div className="title-format">
                    <h2 className="title-margin">Purchase List Detail</h2>
                </div>
                <div className="item-container">
                    <h3>Total Item : {quantity}</h3>
                    <h3 className="payment-total-price">Total Price : {changeRupiah(price)}</h3>
                </div>
            </div>
            <div className="payment-container">
                <div className="title-format">
                    <h2 className="title-margin">Payment Method</h2>
                </div>
                <div className="payment-detail">
                    <select onChange={(e) => setPayment(e.target.value)} className="payment-list">
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Gopayyayy</option>
                        <option>OVOOAE</option>
                    </select>
                    <div className="button-container">
                        <Link to="/cart"><button className="button-checkout cancel">Cancel</button></Link>
                        <button className="button-checkout pay" onClick={ () =>
                        {
                            if (listCheck.length > 0) {
                                ClickToOpen();
                                postInvoice();
                            }
                            else {
                                alert("You Need to Pick at Least 1 Item to Pay")
                            }
                            
                        }
                        }>Pay</button>
                    </div>
                </div>
            </div>
        </div>
        <Dialog open={open}>
            <div className="dialog-boxx">
                <h2 className="payment-status">Payment Succesful</h2>
                <Link to="/">
                <button className="dialog-home-button" onClick={() => {
                    ClickToClose();
                    
                }} 
                >Home</button>
                </Link>
            </div>
        </Dialog>
    </div>
   )
}

export default Cout