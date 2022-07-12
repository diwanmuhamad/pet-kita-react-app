import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import {APIrequest} from '../axios/axios';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import CircularProgress from '@mui/material/CircularProgress';
import "./register.css"
import Alert from '@mui/material/Alert';




function Register() {
    const [see, setSee] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isErr, setIsErr] = useState(false);
    const [errMess, setErrMess] = useState("");
    const [userData, setUserData] = useState({
        email: "",
        username: "",
        password: ""
    });
    console.log(userData)
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const isValidEmail = (email = "") => {
        if (!email) return false; // empty validation

        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const isValidAlphanumeric = (text = "") => {
        if (!text) return false; // empty validation

        let regex = new RegExp("^[a-z0-9]+$");
        return regex.test(text) ? false : true;
    }

    const validateInput = () => {
        if (!userData.username) {
            return "Username Cannot Be Empty"
        }
        if (!isValidEmail(userData.email)) {
            return "Your Email Not Valid"
        }
        if (!isValidAlphanumeric(userData.password) || userData.password.length < 8) {
            return "Your Password Not Valid";
        }

        return "";
    }

        
    const onRegister = () => {
        setIsErr(false);
        setIsSuccess(false);
        setErrMess("");
       
        // validation
        const errorInput = validateInput();
        if (errorInput) {
            setErrMess(errorInput);
            setIsErr(true);
            
            return;
        }

        
        // REGISTER
        setLoading(true)
        APIrequest({
            method: 'post',
            url: 'api/Login2/Register',
            data: userData
        })
        .then((res) => {
            if (res.status === 200) {
                setIsSuccess(true);
            }
        })
        .catch((err) => {
            setIsErr(true);
            setErrMess('Registration failed, ' + err.response.data)
        })
        .finally(() => setLoading(false))
    }



    return ( 
        
        <CssVarsProvider>
        <div className="background-petkitaapp"

          >
            <Sheet 
                variant="outlined"
                sx={{
                    maxWidth: 400,
                    mx: 'auto', // margin left & right
                    mt: '150px', // margin top & botom
                    py: 3, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                    
                }}
                >
                    <div>
                        <Typography style={{color: '#F99941'}} level="h1" component="h2" sx={{ mb: 2, alignSelf: 'center' }}>
                        <b>Sign Up</b>
                        </Typography>
                        <Typography level="body2">Register Your Account</Typography>
                        <br/>
                        <TextField
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            // html input attribute
                            value={userData.email}
                            name="email"
                            type="email"
                            placeholder="petkita@petkita.com"
                            // pass down to FormLabel as children
                            label="Email"
                            
                        />
                        <TextField
                            onChange={(e) => setUserData({...userData, username: e.target.value})}
                            value={userData.username}
                            // html input attribute
                            name="username"
                            type="username"
                            placeholder="username"
                            // pass down to FormLabel as children
                            label="Username"
                        />
                        
                        <TextField
                            onChange={(e) => setUserData({...userData, password: e.target.value})}
                            value={userData.password}
                            // name="password"
                            type={see ? "text" : "password"}
                            placeholder="password"
                            label="Password"
                        ></TextField>
                        <img onClick={() => setSee(!see)} className={loading? "eye-loading" : isSuccess ? "eye-move" : isErr ? "eye-err" : "eye-iconpass"} src={see ? require("../../sourceImage/hidden.png") : require("../../sourceImage/eye.png")} width="20px" height="20px"></img>
                        

                        {
                            isSuccess ? <Typography sx={{color: "green", marginTop: "10px"}}severity="success">Registration Successfull, Check Your Email for Verification</Typography> : null
                        }
                        {
                            isErr ? <Typography sx={{color: "red", marginTop: "10px"}}>{errMess}</Typography> : null
                        }
                        {
                            loading ? <CircularProgress sx={{display: "block", color: "red", marginLeft: "43%",  marginTop: "3%"}}/> : null
                        }
                    
                        <Button
                            onClick={onRegister}
                            sx={{
                                backgroundColor: '#F99941',
                                mt: 1, // margin top
                                color: 'white',
                                
                            }}
                            variant="solid" 
                            color="#F99941"
                            >
                                Sign up
                        </Button>

                       

                        <Typography
                            
                            fontSize="sm"
                            sx={{ alignSelf: 'center', marginTop: "10px", marginBottom: "10px" }}
                        >
                            By creating an account, you agree to PetKita's <a style={{color: "blue"}}>Conditions of Use</a> and <a style={{color: "blue"}}>Privacy Notice</a>.

                        </Typography>

        
                    
                        
                        <Typography
                            endDecorator={<Link sx={{color: '#F99941'}} href="/login">Log in</Link>}
                            fontSize="sm"
                            sx={{ alignSelf: 'center' }}
                        >
                            Already have account?
                        </Typography>
                    </div>
                    </Sheet>
                    
                    
            </div>
            </CssVarsProvider>
        


       
    )
}

export default Register;
