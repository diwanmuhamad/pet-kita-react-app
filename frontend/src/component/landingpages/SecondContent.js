import React, {useState, useEffect} from 'react'
import { APIrequest } from '../axios/axios'
import './secondcontent.css'
import { changeRupiah } from '../../function/priceRupiah'
import { useHistory, useLocation } from 'react-router-dom'

const PetCardPopular = (props) => {
    const history = useHistory()

    const {item} = props;
    return (
    <div key={item.product_id} onClick={() => {
        history.push(`/details/${item.product_id}`);
        window.scrollTo({top: 0});
    }} className='popular-pet-container'>
        <img className="popularpetCard" src={item.image_content}></img>
        <div className='details-pet-popular'>
            <h2>{item.category}</h2>
            <h3>{item.name}</h3>
            <h2>{changeRupiah(item.price)}</h2>
        </div>
    </div>

    )
}

const SecondContent = () => {
    const location = useLocation();
    const [text, setText] = useState("");
    const [list, setList] = useState([]);
    useEffect(() => {
        if (location.pathname == "/cart") {
            setText("Recommended");
        }
        else if (location.pathname == "/") {
            setText("Popular Pet");
        }
        APIrequest({
            method: "GET",
            url: "/api/Data/GetProduct",
            params: {
                sort: "popular"
            }
        }).then((res) => {
            if (res.status == 200) {
                let newlist = res.data.slice(0, 4);
                setList(newlist);
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
    }, [])
      return (
    <div className="secondcontent-main-landing-container">
        <div>
            <h1 className="popularpet-name">{text}</h1>
        </div>
        <div className="popularpetlist-container" >
            {
                list.length > 0 ? 
                list.map(item => <PetCardPopular item={item}/>) : null
            }
        </div>
    </div>
  )
}

export default SecondContent