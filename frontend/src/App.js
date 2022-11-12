import './App.css';
import React, {useEffect, useState} from 'react';
import LandingPages from './Pages/LandingPages';
import ProductDetail from './Pages/ProductDetail';
import LandingPageSearch from './Pages/LandingPageSearch';
import Admin from './Pages/Admin';
import {Switch, Route, useHistory, useLocation, Redirect} from 'react-router-dom';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import Checkout from './Pages/Checkout';
import Verification from './Pages/Verification';
import {APIrequest, getAuthToken, setAuthToken} from "./component/axios/axios";
import {UserContext} from './component/useContext/userContext';
import Cart from './Pages/Cart';
import Invoice from './Pages/Invoice';
import InvoiceDetails from "./Pages/InvoiceDetails"



function App() {
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState({});
  const [order, setOrder] = useState(0);


 

  // APIrequest.defaults.baseURL = localStorage.getItem("@baseurl");
//   useEffect(() => {

//     const jwtToken = getAuthToken();
//     console.log(jwtToken);
//     APIrequest({
//         method: 'Get',
//         url: 'api/Login2/TestToken',
//         headers: {
//             Authorization: jwtToken
//         }
//     })
//       .then((res) => {
//           if (res.status == 200) {
//               // history.replace('/')
//               // refill local token each time app start
//               setAuthToken(jwtToken);
//           }
//       })
//       .catch((err) => {
//           setUser({});
//           history.replace('/')
//           // reset token
//           setAuthToken("");
//       })
     

//     // AXIOS DEFAULT ERROR HANDLER
//     APIrequest.interceptors.response.use(function (response) {
//         return response;
//     }, function (error) {
//         // handle unauthorize
//         if (error.response.status === 401 || error.response.status === 403) {
//             if (location.pathname !== '/login' && location.pathname !== "/") {
//                 history.replace('/');
//                 // reset token
//                 setAuthToken("");
//                 setUser({});
//             }
//         }
//         return Promise.reject(error);
//     });
// }, []);


  return (
    <div className='App-main-default'>
     
      
        <UserContext.Provider value={{user, setUser, setOrder, order}}>
          <Switch>
            <Route exact path='/admin'>
              {
                localStorage.getItem("@role") != "admin" ? <Redirect to="/" /> : 
                <Admin/>
              }
              
              </Route>
            
              
            <Route exact path="/login">
              {getAuthToken() ? <Redirect to="/" /> : <Login/> }
            </Route>
            
            <Route exact path='/signup'>{getAuthToken() ? <Redirect to ="/"/> : <Register/>}</Route>
            <Route path='/cart'><Cart/></Route>
            <Route path='/invoice'><Invoice/></Route>
            <Route path='/invoicedetails'><InvoiceDetails/></Route>
            <Route path='/details/:id'><ProductDetail /></Route>
            <Route path="/verification/:verifToken" exact component={Verification} />
            <Route path='/search'><LandingPageSearch /></Route>
            <Route path='/checkout'><Checkout /></Route>
            <Route path='/'><LandingPages /></Route> 
          </Switch>
        </UserContext.Provider>
      
      
      
    </div> 
  );
}

export default App;
