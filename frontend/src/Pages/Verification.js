import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../component/Navbar/Navbar';
import Footer from '../component/Footer/Footer';
import { APIrequest } from "../component/axios/axios";
import './verification.css';

const EmailVerification = () => {
    const { verifToken } = useParams();

    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        APIrequest({
            method: 'POST',
            url: 'api/Login2/VerifyEmailToken',
            data: { 
                token : verifToken
             }
        })
        .then((res) => {
            if (res.status === 200) {
                setMsg("success");
            }
        })
        .catch((err) => {
            console.log('err verif', err.response.data)
            setMsg("failed");
            setIsError(true);
        })
    }, []);

    return <div>
        <Navbar/>
        {msg
            ? (
                isError
                    ?<div className='background-failed'>
                    <div style={{marginTop:'360px',marginLeft:'330px', textAlign:'center', width:'600px',fontFamily:'Nunito sans'}}>
                        <div style={{borderBottom:'1px solid #F99941', backgroundColor:'#F99941', color:'#FFFFFF',paddingTop:'10px', paddingBottom:'10px',borderTopLeftRadius:'20px',borderTopRightRadius:'20px'}}>
                            <h1>NOTIFICATION</h1>
                        </div>
                        <p style={{backgroundColor:'#FFFFFF',borderBottomLeftRadius:'20px',borderBottomRightRadius:'20px', paddingTop:'10px',paddingBottom:'10px'}}>SORRY!<br></br><br></br>SOMETHING WHEN WRONG</p>
                    </div>
                </div>
                    :<div className='background-success'>
                     <div style={{textAlign:'center', width:'600px',fontFamily:'Nunito sans', position:'absolute', top:'65%', left:'50%', transform:'translate(-50%,-50%)'}}>
                        <div style={{borderBottom:'1px solid #F99941', backgroundColor:'#F99941', color:'#FFFFFF',paddingTop:'10px', paddingBottom:'10px',borderTopLeftRadius:'20px',borderTopRightRadius:'20px'}}>
                            <h1>NOTIFICATION</h1>
                        </div>
                        <p style={{backgroundColor:'#FFFFFF',borderBottomLeftRadius:'20px',borderBottomRightRadius:'20px', paddingTop:'10px',paddingBottom:'10px'}}>YOUR ACCOUNT ARE NOW ACTIVE!<br></br><br></br><Link sx={{color: "#F99941"}} to="/login"><button style={{width:'100px',height:'25px', backgroundColor:'#F99941', border:'none',borderRadius:'15px', color:'#FFFFFF', fontFamily:'Nunito sans'}}>LOGIN</button></Link><br></br><br></br>CLICK LOGIN TO CONTINUE</p>
                    </div>
                </div>
            ) : null}
        <div style={{height:'490px'}}></div>
        <Footer/>
    </div>
};

export default EmailVerification;
