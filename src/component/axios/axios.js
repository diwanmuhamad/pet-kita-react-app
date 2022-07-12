import Axios from 'axios';

export const APIrequest = Axios.create({
    baseURL: process.env.REACT_APP_BASEURL
})

export const setAuthToken = (authToken = "") => {
    // set axios auth header
    APIrequest.defaults.headers.common["Authorization"] = authToken;

    // save to local storage
    localStorage.setItem('@token', authToken);
    // setStorage('@token', authToken);
}

export const getAuthToken = () => {
    return localStorage.getItem('@token');
    // return getStorage('@token');
}
