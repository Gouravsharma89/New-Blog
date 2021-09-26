import axios from "axios";

import { SET_CURRENT_USER,LOG_OUT_CURRENT_USER } from "./types";

export const setCurrentUser = userInfo => dispatch =>{
  
  axios.post("/api/auth/login", userInfo, {
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(res => {
      
      //this.setState({ profile: res.data });
      // console.log(res.data);
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user",JSON.stringify(res.data.user))
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err.response);
    });
};

export const logOutCurrentUser = () => dispatch =>{

      dispatch({
        type: LOG_OUT_CURRENT_USER,
        payload: ''
      });
};
