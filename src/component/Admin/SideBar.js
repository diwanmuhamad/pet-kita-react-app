import React from "react";
import './SideBar.css';
import { useHistory } from "react-router-dom";

const Sidebar = () =>{
    const history = useHistory();
    return(
        <div className="sidebar">
            <div className="sidebar-button">
                    <button onClick={()=> {
                        history.push("/admin", {product: "on", invoice: "off"})
                    }} className="product-button">Pets</button>
                    <button onClick={()=> {
                        history.push("/admin", {product: "off", invoice: "on"})
                    }} className="product-button">Invoice</button>
             </div>
        </div>
    )
}
export default Sidebar