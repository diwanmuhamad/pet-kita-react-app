import React from 'react'
import './footer.css'

const Footer = () => {
  return (
    <div className="footer-main-container">
        <div class="content-footer-container">
            <div className='footer-content first'>
                <h3>Pet Kita</h3>
                <p>Halo Sobat!! Kalian bingung mau mencari pet yang kalian sukai dimana? Pet Kita hadir membantu kalian dalam menemukan pet yang telah lama kalian incar.</p>
                <p>Tunggu apalagi, yuk pesan sekarang</p>
            </div>
            <div className='footer-content second'>
                <h3>Category Pet</h3>
                <ul className='category-footer-li'>
                    <div >
                        <li>Bird</li>
                        <li>Cat</li>
                    </div>
                    <div className='second-li-footer'>
                        <li>Dog</li>
                        <li>Hamster</li>
                    </div>
                </ul>
                
            </div>
            <div className='footer-content third'>
                <h3>Contact</h3>
                <p>Jl. Suka Maju Blok O No 28, Billford, Rock Island, Newland</p>
                <p>021-12345678</p>
                <div className="icon-container-footer">
                    
                    <img className="footer-img" src={require('../../sourceImage/Group97.png')} alt='' width='48' height="48"/>
                    <img className="footer-img" src={require('../../sourceImage/Group98.png')} alt='' width='48' height="48"/>
                    <img className="footer-img" src={require('../../sourceImage/Group99.png')} alt='' width='48' height="48"/>
                    <img className="footer-img" src={require('../../sourceImage/Group100.png')} alt='' width='48' height="48"/>

                    
                    {/* <a href="#" class="fa fa-instagram"></a>
                    <a href="#" class="fa fa-youtube-play"></a>
                    <a href="#" class="fa fa-telegram"></a>
                    <a href="#" class="fa fa-envelope"></a> */}
                </div>
                
            </div>
        </div>

    </div>
  )
}

export default Footer