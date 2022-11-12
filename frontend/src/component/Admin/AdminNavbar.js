import React, { useContext } from "react";
import './AdminNavbar.css'
import { UserContext } from "../useContext/userContext";
import { setAuthToken } from "../axios/axios";
import { useHistory } from "react-router-dom";

const NavbarA = () => {
    const history = useHistory()
    const {user, setUser} = useContext(UserContext);
    return (
    <div className="navbar">
        <div className="logo">
            <h2 className="logo-text">PetKita</h2>
        </div>
        <div className="user-container">
            <label className="admin-name" style={{marginTop:'15px', marginRight:'10px'}}>Admin</label>
            {/* <div className="user user-logo"></div> */}
            <img onClick={() => {
                            history.push("/");
                            setAuthToken("");
                            setUser({});
                            localStorage.setItem("@role", "");
                        }} style={{cursor: "pointer", marginLeft: "60px", marginTop: "13px"}} src={require("../../sourceImage/logout.png")} width="25px" height="25px"></img>
        </div>
    </div>
    )
}

export default NavbarA