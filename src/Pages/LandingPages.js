import React from "react";
import FirstContent from "../component/landingpages/FirstContent";
import SecondContent from "../component/landingpages/SecondContent";
import Navbar from "../component/Navbar/Navbar";
import Footer from "../component/Footer/Footer";

const LandingPages = () => {
    return (
        <div>
            <Navbar/>
            <FirstContent />
            <SecondContent />
            <Footer/>
        </div>

        
    )
}

export default LandingPages;