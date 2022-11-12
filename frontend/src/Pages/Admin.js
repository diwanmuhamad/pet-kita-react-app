import React from "react";
import NavbarA from "../component/Admin/AdminNavbar";
import Sidebar from "../component/Admin/SideBar";
import Prod from "../component/Admin/Product";

const Admin = () => {
    return (
    <div style={{height: '100%'}}>
        <NavbarA/>
        <div style={{display:'flex', height: "100%"}}>
            <Sidebar/>
            <Prod/>
        </div>
    </div>
    )
}

export default Admin;