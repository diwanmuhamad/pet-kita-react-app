import React from 'react'
import './slidermobile.css'
import { useHistory } from 'react-router-dom'

const SliderMobile = (props) => {
  const history = useHistory()
  return (
    <div>
        {
            props.categoryMobile == 1 ? <div onClick={() => history.push("/search", {bird: "bird"})} className='first-category-mobile'><div className='button-category-mobile'>Bird</div></div> :
            props.categoryMobile == 2 ?  <div onClick={() => history.push("/search", {cat: "cat"})} className='second-category-mobile'><div className='button-category-mobile'>Cat</div></div> : 
            props.categoryMobile == 3 ? <div onClick={() => history.push("/search", {dog: "dog"})} className='third-category-mobile'><div className='button-category-mobile'>Dog</div></div> :
            props.categoryMobile == 4 ? <div onClick={() => history.push("/search", {hamster: "hamster"})} className='fourth-category-mobile'><div className='button-category-mobile'>Hamster</div></div> : null
        }

    </div>
   
    
  )
}

export default SliderMobile