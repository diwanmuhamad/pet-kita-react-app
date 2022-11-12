import React from "react";
import Lpsearch from "../component/LandingPageSearch/FirstContentLPS";
import Lpsearch2 from "../component/LandingPageSearch/SecondContent";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";



const LandingPageSearch = () => {
    return(
    <>
        <Navbar/>
            <div className="containerPS">
                
                <Lpsearch/>
                <Lpsearch2/>
            
            </div>
        <Footer/>
    </>
    )
}

export default LandingPageSearch