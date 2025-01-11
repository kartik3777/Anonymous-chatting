import React, { useState } from 'react'
import './Login.css'
import { Outlet, Link , useNavigate, useParams} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios'


function ResetPassword() {
   const {token} = useParams();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [loginData, setLoginData] = useState({
     password: "",
     confirmPassword: ""
    })
    const navigate = useNavigate();
 
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
    async function handleUpdate(){
     if(loginData.password != loginData.confirmPassword){
        alert("Enter same password both in password and in confirm password");
        return;
     }
     if(loginData.password){
      try{
         console.log(token);
         const res=  await axios.patch(`http://localhost:8000/api/v1/users/resetPassword/${token}`, {"password": loginData.password, "confirmPassword":loginData.confirmPassword})
          console.log(res.data);
          alert("password changed!!");
  
      } catch (error) {
            console.log(error);
            alert("something wrong")
        }

      //   console.log(loginData);
        setLoginData(() => {
         return {
            email :"",
            otp: "",
            password: "",
            confirmPassword: ""
         }
        })
     }else{
        alert("Please enter password to proceed")
     }
    
    }
 
     function togglePassword1(){
         var pass = document.getElementById("password");
         if(pass.type === "password"){
             setShow(true);
          pass.type = "text";
         }else{
             setShow(false);
          pass.type = "password";
         }
      }
     function togglePassword2(){
         var pass2 = document.getElementById("confirmPassword");
         if(pass2.type === "password"){
             setShow2(true);
          pass2.type = "text";
         }else{
             setShow2(false);
          pass2.type = "password";
         }
      }

  return (
    <>
     <div>
        <div className="out-cont center">
        <div className="main-login">
 
             <div className="inside-box">
                 <h1 className="heading-login">Reset password</h1>
             </div>
 
             <div className="inside-box inside-box-2">  
                 <div className="input-field-login field-2">
                 <input onChange={handleChange} type="password" value={loginData.password} name="password" id="password" required />
                 <label htmlFor="password">Password</label>
                 <div id='eye' onClick={togglePassword1} className="eye">{show?  <VisibilityOffIcon />: <VisibilityIcon />} </div>
                 </div>
                 <div className="input-field-login field-2">
                 <input onChange={handleChange} type="password" value={loginData.confirmPassword} name="confirmPassword" id="confirmPassword" required />
                 <label htmlFor="confirmPassword">Confirm Password</label>
                 <div id='eye' onClick={togglePassword2} className="eye">{show2?  <VisibilityOffIcon />: <VisibilityIcon />} </div>
                 </div>
            </div>
             <div className="inside-box">
                   <button onClick={handleUpdate} id="login-btn" type="submit"> Update</button>
                   <p>Already have account? 
                    {/* <a href="/Login">Login</a> */}
                    <Link to="/Login" > Login </Link> 
                    </p>
             </div>
        </div>
     </div>
 
     </div>
   
     </>
  )
}

export default ResetPassword
