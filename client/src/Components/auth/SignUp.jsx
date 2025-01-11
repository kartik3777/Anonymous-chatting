import React, { useState } from 'react'
import './Login.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Outlet, Link , useNavigate} from "react-router-dom";
import axios from 'axios'
import ClearIcon from '@mui/icons-material/Clear';
import uploadFile from '../../helpers/uploadFile';


function SignUp() {
   const [uploadPhoto, setUploadPhoto] = useState("");
   const [imageUrl, setImageUrl] = useState("");
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [otpApi, setOtpApi] = useState();
   //  const [email, setEmail] = useState("");
    const [loginData, setLoginData] = useState({
     email :"",
     otp: "",
     password: "",
     confirmPassword: "",
     profile:"",
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
   //   setEmail(loginData.email + "@iitk.ac.in");
   //   console.log(email+" on which otp will be sended");
    }

      
      ////////for profile photo
  

    const handleUploadPhoto = async (e) => {
      const file = e.target.files[0];
      setUploadPhoto(file);
      const uploadPhoto = await uploadFile(file);
      // console.log("uploadPhoto", uploadPhoto);
      const image_url = uploadPhoto.url;
      console.log("image_url", image_url);

      console.log("Before setImageUrl:", imageUrl);
    setImageUrl(image_url);
    console.log("After setImageUrl:", imageUrl);

      // const name = e.target.name;
      // const value = e.target.value;
      // setLoginData((prev) => {
      //     return{
      //         ...prev,
      //         [name] : value
      //     }
      // })
   //    setLoginData((prev) => ({
   //       ...prev,
   //       profile: image, // Set the desired value (e.g., image URL) here
   //   }));
      //**************************************************************************************************//
     ///we have got the image_url from which we can access uploaded image we have to save this in our database
     //**************************************************************************************************//

  }
  const handleClearpPhoto = (e) => {
    e.preventDefault();
      setUploadPhoto("");
  }
 

    function handleLogin(){
      console.log("login data checking",loginData);
      console.log("image url to backend", imageUrl);
     if(loginData.password !== loginData.confirmPassword){
        alert("Enter same password both in password and in confirm password");
     }
     if(loginData.email.length&&loginData.otp&&loginData.password){
        if(loginData.otp !== otpApi){
            alert("opt not matched!!");
            return;
        }
        axios.post("http://localhost:8000/api/v1/users/signup", {
         "email": loginData.email,
          "password": loginData.password,
          "confirmPassword":loginData.confirmPassword,
          "profile": imageUrl
         })
        .then(res => {
         alert("created")
         console.log(res.data);
         navigate("/Login")
        }).catch(err => {
         alert(err)
        })


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
        alert("Please fill all details to proceed")
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


      async function  handleOTP(){   
         if (!loginData.email) {
             alert("Please provide a email number.");
             return;
         }
         
         try {
            const response = await axios.post("http://localhost:8000/api/v1/users/sendOtp", loginData);
            console.log(response.data);
            setOtpApi(response.data.data.otp);
           alert("otp send succesfully")
          } catch (error) {
            console.log({ message: "Error sending otp" });
          }
      }

 
   return (
    <>
     <div>
        
        <div className="out-cont center">
        <div className="main-login">
 
             <div className="inside-box">
                 <h1 className="heading-login">Sign up</h1>
             </div>
 
             <div className="inside-box inside-box-2">
                 <div className="input-field-login field-1">
                 <input onChange={handleChange} type="text" value={loginData.email} name="email" id="email" required />
                 <label htmlFor="email">Email</label>
                 <div onClick={handleOTP} className="sendOtp">Send otp</div>
                 </div>
                 
                 <div className="input-field-login field-1">
                 <input onChange={handleChange} type="text" value={loginData.otp} name="otp" id="otp" required />
                 <label htmlFor="otp">Enter OTP</label>
                 </div>
        
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

                 <div>
            <label htmlFor="profile"> Photo:
              <div className='afterUploadPhoto' style={{border:"1px solid blue", cursor:"pointer"}}>
               {uploadPhoto? 
               <div className='afterUploadPhoto'>
                <p>{uploadPhoto.name}</p>
                <button onClick={handleClearpPhoto} style={{background:"transparent", border:"none", cursor:"pointer"}}>  <ClearIcon /></button> 
               </div>:
                 <p>Upload profile photo</p>}
               </div>
            </label>
            <input onChange={handleUploadPhoto} className='profile_input' type="file" name="profile" id="profile" />
          </div>
                  

            </div>
             <div className="inside-box">
                   <button onClick={handleLogin} id="login-btn" type="submit">Sign up</button>
                   <p>Already have account? 
                    {/* <a href="/Login">Login</a> */}
                    <Link to="/Login" > Login </Link> 
                    </p>
             </div>
            
             {/* <div className="inside-box-4">
                   <span>SignUp with social media</span>
                   <div className="login-icons">
                      <div className="circle circle-1 center"><GoogleIcon style={{fontSize:"30px"}} /></div>
                      <div className="circle circle-2 center"><InstagramIcon style={{fontSize:"30px"}}/></div>
                      <div className="circle circle-3 center"><XIcon/></div>
                   </div>
             </div> */}
            
 
        </div>
     </div>
 
     </div>
   
     </>
   )
}

export default SignUp
