import React, {useState, useContext, useEffect, useRef} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import {APIrequest, getAuthToken, setAuthToken} from "../axios/axios";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { UserContext } from '../useContext/userContext';
import './login.css';


function Login() {
    const {user, setUser, order, setOrder} = useContext(UserContext);
    console.log(user);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const status = useLocation();
    const forInterval = useRef();
    const [googleToken, setGoogleToken] = useState("");
    // const isValidEmail = (email = "") => {
    //     if (!email) return false; // empty validation

    //     return String(email)
    //         .toLowerCase()
    //         .match(
    //             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //         );
    // };

    // const isValidAlphanumeric = (text = "") => {
    //     if (!text) return false; // empty validation

    //     let regex = new RegExp("^[a-z0-9]+$");
    //     return regex.test(text) ? false : true;
    // }

    // const validateInput = () => {
    //     if (!isValidEmail(loginData.email)) {
    //         return "EMAIL NOT VALID"
    //     }
    //     if (!isValidAlphanumeric(loginData.password)) {
    //         return "PASSWORD NOT VALID";
    //     }

    //     return "";
    // }
    const onLogin = () => {
        // validation
        // const errorInput = validateInput();
        // if (errorInput) {
        //     alert(errorInput);
        //     return;
        // }

        // LOGIN
        setLoading(true)
        APIrequest({
            method: 'post',
            url: 'api/Login2/Login',
            data: loginData
        })
        .then((res) => {
            if (res.status === 200) {
                // save auth token to local & axios
                console.log(res.data)
                const jwtToken = "Bearer " + res.data.jwt;
                setAuthToken(jwtToken);
                setUser(res.data);
                localStorage.setItem("@user", res.data.data.id);
                localStorage.setItem("@role", res.data.data.role);
                if (res.data.data.role == "buyer") {
                    history.push("/");
                }
                else if (res.data.data.role == "admin") {
                    history.push("/admin");
                }

                APIrequest({
                    method: "GET",
                    url: "/api/Data/GetOrder",
                    params: {
                        user_id: res.data.data.id
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        setOrder(res.data + 1);
                        localStorage.setItem("@order", res.data + 1);
                    }
                }).catch((err) => {
                    console.log(err.response.data);
                })

                
            }
        })
        .catch((err) => {
            alert('LOGIN FAILED: ' + err.response.data)
        })
        .finally(() => setLoading(false))
    }

    useEffect(()=> {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        document.body.appendChild(script);

        const scriptFunc = document.createElement("script");
        scriptFunc.innerHTML = `
            function handleCredentialResponse(res) {
                console.log(res);
                sessionStorage.setItem("@googleToken", res.credential);
            }
        `

        document.body.appendChild(scriptFunc);

        forInterval.current = setInterval(() => {
            const gToken = sessionStorage.getItem("@googleToken");

            if(gToken) {
                setGoogleToken(gToken);
            }

        },100)

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(scriptFunc);
            clearInterval(forInterval.current);
            sessionStorage.removeItem("@googleToken");
       
        }
    },[])

    useEffect(() => {
        if (googleToken) {
            APIrequest({
                method: "GET",
                url: "/api/Login2/GoogleLogin",
                params: {
                    token: googleToken
                }
            }).then((res) => {
                console.log(res);
                setAuthToken(res.data);
                history.push("/");
            }).catch((err) => console.log(err.response.data))
        }
        
    }, [googleToken])
   
    return (
        <div className="aaaabackground-petkitapps appp"

        >
    <CssVarsProvider>
        
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
                boxShadow: 'md'
            }}
            >
                <div>
                    <Typography style={{color: '#F99941'}} level="h1" component="h2">
                    <b>Welcome!</b>
                    </Typography>
                    {/* {
                        status.state.status === "success" ? <Typography sx={{color: 'green'}} level="body2">Your account successfully registered</Typography> : null
                    } */}
                    <Typography level="body2">Sign in to continue</Typography>
                    <br/>
                    <TextField
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        // html input attribute
                        name="email"
                        type="email"
                        placeholder="petkita@petkita.com"
                        // pass down to FormLabel as children
                        label="Email"
                    />
                    <TextField
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        name="password"
                        type="password"
                        placeholder="password"
                        label="Password"
                    />
                    {/* {
                        valid ? null : <Typography sx={{color: "red"}} level="body2">{errMessage}</Typography>
                    } */}
                    <Button
                    onClick={onLogin}
                    style={{backgroundColor: '#F99941'}}
                    sx={{
                        mt: 1, // margin top
                    }}>
                        Log in
                    </Button>
                    <Typography
                        endDecorator={<Link style={{color: '#F99941'}}   href="/signup">Sign up</Link>}
                        fontSize="sm"
                        sx={{ alignSelf: 'center' }}
                    >
                        Don't have an account?
                    </Typography>
                </div>
                </Sheet>
                
        </CssVarsProvider>
        {/* <script src="https://accounts.google.com/gsi/client" async defer></script> */}
        <div style={{width: "100px"}} 
            id="g_id_onload"
            data-client_id= "123208454278-87gto0eulsbolqkac26f39j4n9ub7rpd.apps.googleusercontent.com"
            data-callback="handleCredentialResponse">
        </div>
        <div style={{width: "200px", marginLeft: "41%", marginTop: "20px"}} class="g_id_signin" data-type="standard"></div>
        </div>


    )
}

export default Login;