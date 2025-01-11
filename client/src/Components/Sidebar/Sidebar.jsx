import React , {useState, useEffect} from 'react'
import './Sidebar.css'
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RecommendIcon from '@mui/icons-material/Recommend';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Link , Outlet} from 'react-router-dom';
import Avtar from '../avtar/Avtar'
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setOnlineUser, setSocket , logout} from '../../redux/userSlice';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';
import Notifications from '../Notification/Notifications';

function Sidebar() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  console.log("redux user", user);
  
  const dispatch = useDispatch();
    useEffect( () => {
       const socket = io("http://localhost:8000", {
        auth:{
              token : localStorage.getItem('token')
        }
       });

       dispatch(setSocket(socket));

       socket.on("onlineUser", (data) => {
        console.log(data);
        dispatch(setOnlineUser(data));
       })

       return ()=>{
        socket.disconnect() 
        }
    }, [])

    const handleLogout= () => {
      axios.get("http://localhost:8000/api/v1/users/logout",)
      .then(res => {
          console.log(res.data);
          dispatch(logout());
          localStorage.clear();
           navigate("/");
           window.location.reload();
          //  window.location.reload();
      }).catch(err => {
          console.log(err);
       alert("error in logging out")
      })
  }

  const handleNotiOut = () => {
    const notiOutDiv = document.querySelector('.noti-out');
    if(notiOutDiv.style.width == "0px"){
      notiOutDiv.style.width = "400px";
      notiOutDiv.style.visibility = "visible";
    }else{
      notiOutDiv.style.width = "0px";
      notiOutDiv.style.visibility = "hidden";
    }
   
  }
 
 
  return (
    <div className='sidebar-out'>
       <div className='noti-out'>
        <Notifications />
      </div>
        {/* <Link  to="/nav/profile">  */}
        <div  className="side-options side-option1"> 
            {/* <div className="icon profile-icon"><AccountCircleIcon fontSize='large' /></div> */}
            <Avtar profile= {user.profile} size="45px" />
            <div className="profile-name">Hello, 
              {user.name}
              </div>
          </div>     
           {/* </Link> */}
      
          <Link to="/nav/home"> 
           <div  className="side-options side-option2">
            <div className='option-out'>
             <div className="icon"><HomeIcon fontSize='small' /></div>
             <div className="options-text">Home</div>
            </div>
          </div>  
          </Link>
          <Link  to="/nav/profile"> 
          <div  className="side-options side-option9"> 
          <div className='option-out'>
            <div className="icon"><PersonIcon fontSize='small' /></div>
            <div className="options-text">My Profile</div>
          </div>
          </div>    
            </Link>
           <Link  to="/nav/search">
              <div  className="side-options side-option3">
          <div className='option-out'>
          <div className="icon"><SearchIcon fontSize='small' /></div>
          <div className="options-text">Search</div>
              </div>
          </div> 
           </Link>
          <Link  to="/nav/message"> 
           <div   className="side-options side-option6">
          <div className='option-out'>
          <div className="icon"><MessageIcon fontSize='small' /></div>
          <div className="options-text">Messages</div>
              </div>
          </div>  
          </Link>
          {/* <Link  to="/nav/notifications">  */}
           <div onClick={handleNotiOut} className="side-options side-option4">
          <div className='option-out'>
          <div className="icon"><NotificationsIcon fontSize='small' /></div>
          <div className="options-text">Notifications</div>
              </div>
          </div>  
          {/* </Link> */}
          {/* <Link  to="/nav/recommendation">    */}
           <div   className="side-options side-option5">
          <div className='option-out'>
          <div className="icon"><RecommendIcon fontSize='small' /></div>
          <div className="options-text">Recommendation</div>
              </div>
          </div> 
           {/* </Link>
          <Link  to="/nav/setting">  */}
          <div   className="side-options side-option7">
          <div className='option-out'>
          <div className="icon"><SettingsIcon fontSize='small' /></div>
          <div className="options-text">Setting</div>
              </div>
          </div>  
          {/* </Link> */}
           <div onClick={handleLogout} 
           className="side-options side-option8">
        <div className='option-out'>
          <div  className="icon"><LogoutIcon fontSize='small' /></div>
          <div className="options-text">Log Out</div>
          </div>
          </div> 
    </div>
  )
}

export default Sidebar
