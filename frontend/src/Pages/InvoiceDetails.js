import React from "react";
import Navbar from "../component/Navbar/Navbar";
import InvDetails from "../component/InvoicesDetails/InvoiceDetails";
import Footer from "../component/Footer/Footer";


const Invdets = () => {
    return(
        <div>
            <Navbar/>
            <InvDetails/>
            <Footer/>
        </div>
    )
}

export default Invdets