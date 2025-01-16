import React, { useState } from 'react'
import './Login.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../redux/userSlice';
import { saveState } from '../../redux/localStorage';
import { store } from '../../redux/store';

function Login() { 
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
   const [loginData, setLoginData] = useState({
    email :"",
    password: ""
   })

   function handleChange(e){
    const name = e.target.name;
    const value = e.target.value;
    setLoginData((prev) => {
        return{
            ...prev,
            [name] : value
        }
    })
   }
   axios.defaults.withCredentials = true;
   function handleLogin(){
    axios.post("https://anonymous-chatting-hz91.vercel.app/api/v1/users/login", {"email": loginData.email, "password": loginData.password})
    .then(res => {
        console.log("login data");
        console.log(res.data);
        dispatch(setUser(res.data.data.user));
        dispatch(setToken(res.data.token));
        saveState(store.getState());
        localStorage.setItem('token', res.data.token);

                navigate("/nav/home");
    }).catch(err => {
        console.log(err);
     alert("error occured")
    })

    // console.log(loginData);
   setLoginData(() => {
    return {
        email :"",
        password: ""
    }
   })
   }

   function togglePassword(){
        var pass = document.getElementById("password");
        if(pass.type === "password"){
            setShow(true);
         pass.type = "text";
        }else{
            setShow(false);
         pass.type = "password";
        }
 }

  return (
    // <div>
       
       <div className="out-cont center">
        <p className='test-user'>
            Details of test_users
            <br />
            Email: test@20, Password: 100
            <br />
            Email: test@100, Password: 100
        </p>
       <div className="main-login">

            <div className="inside-box">
                <h1 className="heading-login">Login</h1>
            </div>

            <div className="inside-box inside-box-2">
                <div className="input-field-login field-1">
                <input onChange={handleChange} type="text" value={loginData.email} name="email" id="email" required />
                <label htmlFor="email">Email</label>
                </div>
       
                <div className="input-field-login field-2">
                <input onChange={handleChange} type="password" value={loginData.password} name="password" id="password" required />
                <label htmlFor="password">Password</label>
                <div id='eye' onClick={togglePassword} className="eye">{show?  <VisibilityOffIcon />: <VisibilityIcon />} </div>
                </div>
           </div>

            <div className="forgot">  <a href="forgotpassword">Forgot password?</a>
            </div>
        
            <div className="inside-box">
                  <button onClick={handleLogin} id="login-btn" type="submit">Login</button>
                  <p>Don't have an account yet? 
                     <Link style={{marginLeft:"5px"}} to="/SignUp">Sign up</Link>
                     </p>
            </div>

       </div>
    </div>

    // </div>
  )
}

export default Login
