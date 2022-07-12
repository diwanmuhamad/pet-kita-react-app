import React, {useState, useRef} from 'react';
import { useHistory } from 'react-router-dom';
import SliderFirstContent from './SliderFirstContent';
import SliderMobile from './SliderMobile';
import './firstcontent.css';

const FirstContent = () => {
    const history = useHistory();
    const move = useRef();
    const [change, setChange] = useState(true);
    const [banner, setBanner] = useState(1);
    const [categoryMobile, setCategoryMobile] = useState(1);
    const rightButton = () => {
        if (categoryMobile + 1 <= 4) {
            setCategoryMobile(categoryMobile+1);
        }
        else {
            setCategoryMobile(1);
        }
    }

    const leftButton = () => {
        if (categoryMobile - 1 >= 1) {
            setCategoryMobile(categoryMobile - 1);
        }
        else {
            setCategoryMobile(4);
        }
    }
    const changePic = () => {
        move.current = setInterval(() => setBanner((prev) => {
            if (prev+1 <= 3) {
                return prev+1;
            }
            return 1;
        }), 7000);
        setChange(false);
    }
  return (
    <div className='landing-page-firstcontent-container'>
        <div className='slider-grid-container'>
            <div>
                {
                    change? changePic() : null
                }

                <SliderFirstContent setBanner={setBanner} banner={banner}/>  
                
                
            </div>
            <div className="grid-container">
                <div class="first-image-bird-container">
                    <div><button onClick={(e) => {
                        e.preventDefault();
                        history.push("/search", {bird: 'bird', categoryPage: 'on'});
                    }} class="firstcontent-pet-container">Bird</button></div>
                </div>
                <div class="first-image-cat-container">
                    <div><button onClick={(e) => {
                        e.preventDefault();
                        history.push("/search", {cat: 'cat', categoryPage: 'on'})
                    }} class="firstcontent-pet-container">Cat</button></div>
                </div>
                <div class="first-image-dog-container">
                    <div><button onClick={(e) => {
                        e.preventDefault();
                        history.push("/search", {dog: 'dog', categoryPage: 'on'})
                    }} class="firstcontent-pet-container">Dog</button></div>
                </div>
                <div class="first-image-hamster-container">
                    <div ><button onClick={(e) => {
                        e.preventDefault();
                        history.push("/search", {hamster: 'hamster', categoryPage: 'on'})
                    }} class="firstcontent-pet-container">Hamster</button></div>
                </div>
                
            </div>
            <div className="slider-mobile-carousel"> 
                <div onClick={leftButton} className='button-mobile'><i class="arrow left"></i></div>
                <SliderMobile categoryMobile={categoryMobile} />
                <div onClick={rightButton} className='button-mobile'><i class="arrow right"></i></div>
            </div>

        </div>
        <div className="line-firstcontent"></div>
    </div>
  )
}

export default FirstContent;