import React,{useEffect, useState, useContext}from 'react';
import './cart.css';
import Checkbox from '@mui/material/Checkbox';
import { useHistory } from 'react-router-dom';
import { APIrequest } from '../axios/axios';
import { UserContext } from '../useContext/userContext';
import { changeRupiah } from '../../function/priceRupiah';


const ItemCart = (props) => {
    const {checks, setChecks, listProductId, listCart, item, setPrice, setListCart, setQuantity, totalPrice, totalQuantity} = props;
    const [count, setCount] = useState(item.quantity);
    const [check, setCheck] = useState(false);

    const addcount = () =>{
        if (count+1 <= item.quantityproduct) {
            setCount(prev => prev + 1)
        }
        
        
     }


  
     const minuscount = () =>{
        if(count > 1){
            setCount(prev => prev - 1)
        } 
     }

     useEffect(() => {
        let temptArr = [...listCart];
        let tempt = listProductId.indexOf(item.product_id)
        temptArr[tempt] = {...temptArr[tempt], status: check};
        setListCart(temptArr);
        console.log(temptArr);
     },[check])

     useEffect(()=> {
        if (!check) {
            setChecks(false);
        }
     }, [check])

     useEffect(() => {
        if (checks) {
            setCheck(true);
        }
    },[checks])

     useEffect( () => {
        
        APIrequest({
            method: "POST",
            url: "/api/Data/PostCart",
            data : {
                fk_product_id: item.product_id,
                quantity: count,
                fk_user_id: localStorage.getItem("@user"),
                order: localStorage.getItem("@order"),
                no_invoice: "nice",
                action: "edit"
            }
        }).then((res) => {
            if (res.status == 200) {
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
                        setListCart(res.data);
                        console.log(res.data);
                    }
                }).catch((err) => {
                    console.log(err.response.data);
                })
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
     },[count])

    return (
        <div key={item.product_id} className='list-box'>
                <div className='container-list'>
                    <div onClick={() => {
                            setCheck(!check);
                            }} className={check ? "listss22": "listss"}><p className="checklistmarks">&#10004;</p></div>
                    

                    <img className="image-cart-pets" src={item.image_content} ></img>

                    <div className='list-cart-text'>
                        <h3 className='item-name'>{item.name}</h3>
                        <h3 className='item-price'>{changeRupiah(item.price)}</h3>
                    </div>
                    
                    <div className="add-quantity-item">
                            <button className="minus-qty" onClick={() => {minuscount()}}>-</button>
                            <h2 className='font-quantity'>{count}</h2>
                            <button className="plus-qty" onClick={() => {addcount()}}>+</button>
                    </div> 
                </div>
                <div className='line-cart-item'></div>

            </div>
    )
}


const ListCart = () => {
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const {user, setUser, order, setOrder} = useContext(UserContext);
    const history = useHistory()
    const [listCart, setListCart] = useState([]);
    const [listProductId, setListProductId] = useState([]);
    const [count, setCount] = useState(1);
    const [lost, setLost] = useState(true);
    const [check, setCheck] = useState(false);
    

    const onDelete = () => {
        let arr = [];
        if (check) {
            arr = [...listProductId];
        }
        else {
            listCart.forEach(item => {
                if (item.status) {
                    arr.push(item.product_id);
                }
            })
        }

        arr.forEach(item => {
            APIrequest({
                method: "DELETE",
                url: "api/Data/DeleteCart",
                params : {
                    product_id: item,
                    user_id : localStorage.getItem("@user"),
                    order: localStorage.getItem("@order")
                    }
            }).then((res) => {
                    if (res.status == 200) {
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
                                setListCart(res.data);
                                setListProductId(listProduct(res.data));
                                console.log(res.data);
                            }
                        }).catch((err) => {
                            console.log(err.response.data);
                        })
                    }
            }).catch((err)=> {
                console.log(err.response.data);
            })
      
        })

        
              
        return arr;
    }

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

     const dissappear = () => {
        if (window.scrollY > 700) {
            setLost(false);
        } 
        else {
            setLost(true);
        }

     }

     const listProduct = (list) => {
        let arr = [];
        list.forEach(item => {
            arr.push(item.product_id);
        })
        return arr;
     }
    

     useEffect(() => {
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
                setListCart(res.data);
                setListProductId(listProduct(res.data));
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
     },[])

     useEffect(() => {
        document.addEventListener("scroll", dissappear);

        return () => {
            document.addEventListener("scroll", dissappear);
        }
     }, [])
    return(
        <div>
        { listCart.length == 0? 
            <div className='cart-no-item'>
                <div className='container-cart-no-item'>
                <h2 className='h2-no-item-incart'>No item selected in cart</h2>
                <button onClick={(e) => {
                    e.preventDefault();
                    history.push("/");
                }} className='buttonbacktohome'>Back to Home</button>
                </div>
            </div> 
            :
            <>
            <div className="container-top">
                <div style={{ display: 'flex'}}>
               
                        <div onClick={() => {
                            setCheck(!check);
                            }} className={check ?  "checkboxcheckeds" : "checkboxdivs"}><p className="checklistmarks">&#10004;</p></div>

                    <h2 className='upper-font'>Select All</h2>
                </div>

                <div onClick={() => console.log(onDelete())} style={{ display: 'flex', cursor: "pointer"}}>
                    
                    <img className="trash-image-cart" src={require("../../sourceImage/trash.png")} ></img>
                    <h3 className='delete-font'>Delete Item</h3>
                </div>
            </div>
            
                <div className='line-top'></div>
            
            {
                listCart.length == 0 ? null :
                listCart.map(item => {
                    return <ItemCart item={item} listProductId={listProductId} listCart={listCart} checks={check} setChecks={setCheck} setListCart={setListCart} setPrice={setPrice} setQuantity={setQuantity} totalPrice={totalPrice} totalQuantity={totalQuantity} />
                })
            }
            </>
            
        }
           
           
            <div className={lost? "container-total" : "lost-total"}>
                <div className='container-shopping-detail'>
                    <h3 className='font-shopping-details'>Shopping Details</h3>

                    <div className='container-item'>
                        <h3 className='style-item'>item</h3>
                        <h3 className='style-qty'>{quantity}</h3>
                    </div>
                    <div className='line-shopping-details'></div>

                    <div className='container-total-price'>
                        <h2 className='style-totprice'>Total Price</h2>
                        <h2 className='font-totprice'>{changeRupiah(price)}</h2>
                    </div>
                </div>
                <button onClick={(e) => {
                    e.preventDefault();
                    if (listCart.length > 0) return history.push("/checkout", {price: price, quantity: quantity});
                }} className={listCart.length == 0? 'style-buynow-buttonnow' : 'style-buynow-button' }>Buy Now</button>
            </div>
            
            
           
            
            
        </div>
    )
}

export default ListCart;