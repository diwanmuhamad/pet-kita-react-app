import React from "react";
import Inv from "../component/invoice/Invoice";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";


const Invoice = () =>{
    return(
        <div>
            <Navbar/>
            <Inv/>
            <Footer/>
        </div>
    )
}

export default Invoice