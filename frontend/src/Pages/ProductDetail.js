import React from "react";
import SecondContentPD from "../component/ProductDetail/SecondContentPD";
import FirstContentPD from "../component/ProductDetail/FirstContentPD";
import ThirContentPD from "../component/ProductDetail/ThirdContentPD";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";


const ProductDetail = () => {
    return (
        <div>
            <Navbar/>
            <FirstContentPD/>
            <SecondContentPD/>
            <ThirContentPD />
            <Footer/>
        </div>
    )
}

export default ProductDetail