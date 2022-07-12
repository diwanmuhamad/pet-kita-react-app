import React from 'react';
import './sliderfirstcontent.css';
import { useHistory } from 'react-router-dom';

const SliderFirstContent = (props) => {
  const history = useHistory();
  return (
    <div className='slider-container'>
      {
        props.banner == 1? 
        <div className='first-banner image-first-banner'>
          <div onClick={() => {
            history.push("/cart");
          }} className='cart-container-mobile'><i className='but fa fa-shopping-cart'></i></div>
          <div className="radio-input-container">
            <input type="radio" />
            <input onClick={() => props.setBanner(2)} type="radio" />
            <input onClick={() => props.setBanner(3)} type="radio" />
          </div>
        </div> : 
        props.banner == 2? 
        <div className='second-banner image-second-banner'>
          <div onClick={() => {
            history.push("/cart");
          }} className='cart-container-mobile'><i className='but fa fa-shopping-cart'></i></div>
          <div className="radio-input-container">
            <input onClick={() => props.setBanner(1)} type="radio" />
            <input type="radio" />
            <input onClick={() => props.setBanner(3)} type="radio" />
          </div>
        </div> :
        props.banner == 3? 
        <div className='third-banner image-third-banner'>
          <div onClick={() => {
            history.push("/cart");
          }} className='cart-container-mobile'><i className='but fa fa-shopping-cart'></i></div>
          <div className="radio-input-container">
            <input onClick={() => props.setBanner(1)} type="radio" />
            <input onClick={() => props.setBanner(2)} type="radio" />
            <input type="radio" />
          </div>
        </div> : null 

      }

    </div>
  )
}

export default SliderFirstContent;