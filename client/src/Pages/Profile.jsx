import React, {useState} from 'react'
import './Profile.css'
// import { AuthContext } from '../components/auth/AuthContext';
import { useSelector } from 'react-redux';
import Avtar from '../Components/avtar/Avtar';
import ClearIcon from '@mui/icons-material/Clear';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';
import { saveState } from '../redux/localStorage';
import { store } from '../redux/store';
import Revealed from '../Components/Revealed/Revealed';

function UserValues(props){
  return <div className="user-field">
  <p>{props.field}</p>
  <div className='user-value'>{props.value}</div>
</div>
}

function Profile() {
  const dispatch = useDispatch();
  //to access user data in any component 
  const user = useSelector(state => state.user);
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [image_upload_url, setImageUploadUrl] = useState("");

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    setUploadPhoto(file);
    const uploadPhoto = await uploadFile(file);
    // console.log("uploadPhoto", uploadPhoto);
    setImageUploadUrl(uploadPhoto.url);
    
    //**************************************************************************************************//
   ///we have got the image_url from which we can access uploaded image we have to save this in our database
   //**************************************************************************************************//

}
const updateProfile = async () => {
  axios.patch("http://localhost:8000/api/v1/users/updateMe", {
      profile :image_upload_url,
      id: user._id
    })
   .then(res => {
    alert("updated!!")
    dispatch(setUser(res.data.data.user));
    saveState(store.getState());
    setUploadPhoto("");
    console.log(res.data);
   }).catch(err => {
    alert(err)
   })
}

const handleClearpPhoto = (e) => {
  e.preventDefault();
    setUploadPhoto("");
}

  return  (
   <div className='profile-page'>
        <div className="profile-heading">
          <h1>My Profile</h1>
        </div>
        <div className="profile-main">
           <div className="profile-main-data">
              <div className="details-heading">
                    <p>Your details</p>
              </div>
              <div className="detail-out">
                < UserValues field="Full Name" value={user.name} />  
                < UserValues field="Roll number" value={user.rollno} />  
                < UserValues field="Email" value={user.email} />  
                < UserValues field="Gender" value={user.gender} />  
                < UserValues field="Branch" value={user.branch} />  
              </div>
           </div>

           <div className="profile-upload">
              <div className="bachhe show-outer">
                <Avtar profile={image_upload_url? image_upload_url: user.profile} size="100px" />
              </div>
              <div className="bachhe upload">
              <div>
            <label htmlFor="profile_pic"> 
              <div className='beforeUploadPhoto'>
               {uploadPhoto? 
              //  <div className='afterUploadPhoto'>
              //   <p style={{fontSize:"14px"}}>{uploadPhoto.name}</p>
              //   <button onClick={handleClearpPhoto} style={{background:"transparent", border:"none", cursor:"pointer"}}>  <ClearIcon /></button> 
              //  </div>
              <div className='afterUploadPhoto'>
                 <p onClick={updateProfile}>Update profile</p>
                 <button onClick={handleClearpPhoto} style={{background:"transparent", border:"none", cursor:"pointer"}}>  <ClearIcon /></button> 
              </div>
               :
                 <p>Edit profile </p>}
               </div>
            </label>
            {
              !uploadPhoto && <input onChange={handleUploadPhoto} className='profile_input' type="file" name="profile_pic" id="profile_pic" />
            }
            
          </div>
              </div>
           </div>

        </div>
        <Revealed />
   </div>
 )
}
   

export default Profile
