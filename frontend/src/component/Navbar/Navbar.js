import React, {useState, useContext} from "react";
import { useHistory, useLocation } from "react-router-dom";
import './navbar.css';
import {Link} from 'react-router-dom';
import { UserContext } from "../useContext/userContext";
import { setAuthToken, getAuthToken } from "../axios/axios";


const Navbar = () => {
    const {user, setUser, order, setOrder} = useContext(UserContext);
    console.log(user);
    const history = useHistory();
    const location = useLocation();

    if (location.state != undefined) {
        if (location.state.sort == undefined) {
            location.state.sort = "";
        }
        if (location.state.data == undefined) {
            location.state.data = "";
        }
        if (location.state.min == undefined) {
            location.state.min = 0;
        }
        if (location.state.max == undefined) {
            location.state.max = 0;
        }
        if (location.state.all == undefined) {
            location.state.all = "";
        }
        if (location.state.dog == undefined) {
            location.state.dog = "";
        }
        if (location.state.cat == undefined) {
            location.state.cat = "";
        }
        if (location.state.bird == undefined) {
            location.state.bird = "";
        }
        if (location.state.hamster == undefined) {
            location.state.hamster = "";
        }

    }

    if (location.state == undefined) {
        location.state = {
            search: "",
            sort: "",
            min: 0,
            max: 0,
            all: "",
            cat: "",
            dog: "",
            bird: "",
            hamster: ""
        }
    }



    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [isDialog, setIsDialog] = useState(false);

    return (
        <nav className="landingpage-main-container">
            <div className="logo-searchbar">
                {   
                    isSearch ?
                    <Link className="petkita-logo-2" to='/'>
                        <div className="petkita-logo-2">
                            PetKita
                        </div>
                    </Link> : 
                    <Link className="petkita-logo" to='/'>
                        <div className="petkita-logo">
                            PetKita
                        </div>
                    </Link> 
                }
                
                <div>
                    <form className="searchform">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" placeholder="Search Product" type="text"></input>
                        <button onClick={
                            (e) => {e.preventDefault();history.push("/search", {data: search, sort: location.state.sort, min: location.state.min, max: location.state.max, all: location.state.all, bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage, page: 1} )}
                        } className="button-search" type="submit"><i className="fa fa-search"></i></button>
                    </form>
                
                </div>
                
            </div>
            {
                isDialog && getAuthToken() != "" ? 
                <div >
                    <div className="dialog-box-login">
                        <form className="button-dialog-container-login">
                            <img onClick={() => {
                                history.push("/invoice");
                            }} style={{cursor: "pointer", marginLeft: "50px"}} src={require("../../sourceImage/invoice.png")} width="25px" height="25px"></img>
                            <img onClick={() => {
                                history.push("/");
                                setAuthToken("");
                                setUser(0);
                                setOrder(0);
                                localStorage.setItem("@user", {});
                                localStorage.setItem("@order", 0);
                                localStorage.setItem("@role", "");
                            }} style={{cursor: "pointer", marginLeft: "50px"}} src={require("../../sourceImage/logout.png")} width="25px" height="25px"></img>

                        </form>
                       
                    </div> 
                    <div onClick={() => setIsDialog(false)} className="blur-image-login"></div>
                </div>
                :
                isDialog ?
                <div >
                    <div className="dialog-box">
                        <form className="button-dialog-container">
                            <Link className="displaybutton" to="/signup"><button onClick={() => setIsDialog(false)} className="buttonog signup-dialog">Sign Up</button></Link>
                            <Link className="displaybutton" to="/login"><button onClick={() => setIsDialog(false)} className="buttonog login-dialog">Login</button></Link>

                        </form>
                       
                    </div> 
                    <div onClick={() => setIsDialog(false)} className="blur-image"></div>
                </div>
                : null
                
            }
            
            {
                isSearch?  
                <div className="container-search-mobile">
                    <div className="container-search-mobile">
                        <form className="searchform-mobile-2">
                            <input onChange={(e) => setSearch(e.target.value)} className="search-input-mobile-2" placeholder="Search Product" type="text"></input>
                            <button onClick={(e) => {e.preventDefault();setIsSearch(false); 
                            history.push("/search", {data: search})
                            }} className="button-search-mobile-2" type="submit"><i className="fa fa-search"></i></button>
                        </form>
                        
                    </div>
                    <div onClick={() => setIsDialog(!isDialog)} className="fa fa-bars" id="burger-menu2">

                    </div>
                </div> :

                <div className="container-search-mobile">
                    <div>
                        <form className="searchform-mobile">
                            <input className="search-input-mobile" placeholder="Search Product" type="text"></input>
                            <button onClick={(e) => {e.preventDefault(); setIsSearch(true)}} className="button-search-mobile" type="submit"><i className="fa fa-search"></i></button>
                        </form>
                        
                    </div>
                    <div onClick={() => setIsDialog(!isDialog)} className="fa fa-bars">

                    </div>
                </div>
            }
           
            <div className="cart-login-signup-container">
                <div className="cart-logo1">
                    <button onClick={(e) => {
                        e.preventDefault();
                        history.push("/cart");
                    }} type="submit"><i className="fa fa-shopping-cart"></i></button>
                </div>
                {
                    getAuthToken() != "" ?
                    <div style={{display: "flex", marginRight: "10px"}}> 
                        <img onClick={() => {
                            history.push("/invoice");
                        }} style={{cursor: "pointer", marginLeft: "50px", marginTop: "7px"}} src={require("../../sourceImage/invoice.png")} width="25px" height="25px"></img>
                        <img onClick={() => {
                            history.push("/");
                            setAuthToken("");
                            setUser(0);
                            setOrder(0);
                            localStorage.setItem("@user", {});
                            localStorage.setItem("@order", 0);
                        }} style={{cursor: "pointer", marginLeft: "50px", marginTop: "7px"}} src={require("../../sourceImage/logout.png")} width="25px" height="25px"></img>

                    </div> 
                    
                    :
                    <div style={{display: 'flex'}}>
                         <div className="line-navbar-1"></div>  
                        <div>
                            <form>
                                <Link to="/signup"><button className="button sign-up">Sign Up</button></Link>
                            </form>
                        </div>
                        <div>
                            <form>
                                <Link to="/login"><button className="button login">Login</button></Link>
                            </form>
                        </div>
                    </div>
                       
                    

                    
                }
                
            </div>
        </nav>
    )
}

export default Navbar;