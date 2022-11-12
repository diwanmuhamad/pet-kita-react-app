import React from "react";
import ListCart from "../component/cart/Cart";
import Navbar from "../component/Navbar/Navbar";
import SecondContent from "../component/landingpages/SecondContent";
import Footer from "../component/Footer/Footer";

const Cart = () =>{
    return (
    <div>
        <Navbar />
        <ListCart />
        <SecondContent />
        <Footer />
    </div>
    )
}

export default Cart