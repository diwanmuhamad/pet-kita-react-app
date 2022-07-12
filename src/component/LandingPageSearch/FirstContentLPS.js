import React, {useState, useEffect, useRef} from "react";
import './FirstContentLPS.css'
import { changeRupiah, changeFirstLetter } from "../../function/priceRupiah";
import { APIrequest } from "../axios/axios";
import { useHistory, useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

const PetCard = (props) => {
    
    const history = useHistory();
    const {item} = props;
    return (
        <div onClick={(e) => {
            e.preventDefault();
            history.push(`/details/${item.product_id}`);
            window.scrollTo({top: 0});
        }} className="pet-container" key={item.product_id}>
            <img className="pet-image" src={item.image_content}></img>
            <div className="pet-detail">
                <h2>{item.category}</h2>
                <h3>{item.name}</h3>
                <h2>{changeRupiah(item.price)}</h2>
            </div>
        </div>
    )
}

const Lpsearch = () =>{
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const myRef = useRef();
    const location = useLocation();
    console.log(location.state);
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
        if (location.state.categoryPage == undefined) {
            location.state.categoryPage = "";
        }
        if (location.state.page == undefined) {
            location.state.page = 1;
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
            hamster: "",
            page: 1,
        }
    }
    
    console.log(location);
    const [listThreeProduct, setThreeProduct] = useState([]);
    const [firstNot, setFirstNot] = useState(true);
     

   
    const setList = (list) => {
        let result = [];
        for (let i = 0; i < list.length; i+=3) {
            result.push(list.slice(i, i+3));
        }
        return result; 
    }
    
    // useEffect(() => {
    //     console.log(myRef);
    //     const observer = new IntersectionObserver((entries, observer) => {
    //         const entry = entries[0];
    //         if (entry.isIntersecting) {
    //                 setPage(prev => prev+1);
            
    //             console.log("tes");
    //         }
    //         // else {
    //         //     setPage(prev => prev-1)
    //         // }
    //         observer.observe(myRef.current);
            
    //       });
    //     observer.observe(myRef.current);
    // }, [])

    useEffect(() => {
        setLoading(true);
        APIrequest({
            method: "GET",
            url: "/api/Data/GetProduct",
            params: {
                        search: location.state.data,
                        sort: location.state.sort,
                        min: location.state.min,
                        max: location.state.max,
                        all: location.state.all,
                        dog: location.state.dog,
                        cat: location.state.cat,
                        bird: location.state.bird,
                        hamster: location.state.hamster,
                        page: page
                    }
        }).then((res) => {
            if (res.status === 200) {
                setFirstNot(false);
                setThreeProduct(setList(res.data));
                
            }
        }).catch((err) => {
            console.log(err.response.data);
        }).finally(() => {
            setLoading(false);
        })
    }, [location.state.data, location.state.sort, location.state.min, location.state.max, location.state.all, location.state.bird, location.state.dog, location.state.cat, location.state.hamster, page])
    return(
        <div className="LPS-Container">
            <div className="LPS-Container-pet-detail">
            <div onClick={() => history.push("/cart")} className='cart-container-mobile'><i className='but fa fa-shopping-cart'></i></div>
                <div className="result-text">
                    {
                        location.state.categoryPage ?
                        <div style={{display: "flex"}}>
                            <h2 style={{color: "#828282", marginRight: "10px"}}>Home</h2>
                            <h2 style={{color: "#828282", marginRight: "10px"}}>&gt;</h2>
                            <h2 style={{color: "#F99941"}}>{changeFirstLetter(location.state.bird) || changeFirstLetter(location.state.dog) || changeFirstLetter(location.state.hamster) || changeFirstLetter(location.state.cat)}</h2>
                        </div>
                        :

                        <h2 style={{color: "#4F4F4F"}}>Result for '
                            <span style={{color: '#F99941'}}>{location.state.data}</span>
                        '</h2>
                        
                    }
                    
                </div>
               
               <div className="superabove-pet-container">
                    {
                            loading ? <CircularProgress sx={{color: "red", marginLeft: "48%", marginTop: "3%"}}/> : 
                            listThreeProduct.length != 0 || firstNot ?
                            listThreeProduct.map(item => {
                                return (
                                <div className="above-pet-container">
                                {
                                    item.map(item => {return <PetCard item={item}/>})
                                }
                                </div>
                                )
                            })
                            :
                            <div className="notFound"><h2>Result not found</h2></div>
                            
                        }

               </div>
                
                
            </div>
            {/* <div style={{marginTop: "300px", width: "30px", height: "10px"}} ref={myRef}></div> */}
        </div>
    )
}

export default Lpsearch