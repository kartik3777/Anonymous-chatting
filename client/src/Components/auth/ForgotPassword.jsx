import React, { useState } from 'react'
import './Login.css'
import { Outlet, Link , useNavigate} from "react-router-dom";
import axios from 'axios'

function ForgotPassword() {
    const [email, setEmail] = useState("")

    async function handleSubmit(){
        if(!email){
            alert("Please enter email to proceed!");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/forgotPassword", {"email": email});
            console.log(response.data);
            setEmail("")
            alert("A reset link has been send to your Email")
        } catch (error) {
            console.log({ message: "Error sending reset link" });
        }
    }
 
   return (
    <>
     <div>
        
        <div className="out-cont center">
        <div className="main-login">
 
             <div className="inside-box">
                 <h1 className="heading-login">Forgot password</h1>
             </div>
 
             <div className="inside-box inside-box-2">
                 <div className="input-field-login field-1">
                 <input onChange={(event) => {setEmail(event.target.value)}} type="text" value={email} name="email" id="email" required />
                 <label htmlFor="email">Email</label>
                 </div>
             
            </div>
             <div className="inside-box">
                   <button onClick={handleSubmit} id="login-btn" type="submit">Submit</button>
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

export default ForgotPassword
