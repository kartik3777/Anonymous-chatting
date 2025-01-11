import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './notification.css'
import { useSelector } from "react-redux";
import Avtar from '../avtar/Avtar';

const Notifications = () => {
    const user = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = user?._id;
        const response = await axios.get(`http://localhost:8000/api/v1/users/getnotifications/${userId}`);
        console.log(response.data);
        
        setNotifications(response.data.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user?._id]);

  const handleReadNotification = async (id) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/v1/users/markread`, {
            notificationId: id
        });
        alert("notification readed");
        console.log(response);
      } catch (error) {
        console.error('Error reading notification:', error);
      }
  }

  const handleReject = async (notification) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/v1/users/rejectrequest`, {
            senderId : user._id,
            recipientId: notification.senderId
        });
        alert("request rejected");
        console.log(response);
        
        const notificationId = notification._id;
        const res = await axios.delete(`http://localhost:8000/api/v1/users/deletenotification/${notificationId}`);
        alert("notification deleted");
      } catch (error) {
        console.error('Error in rejecting or deleting request:', error);
      }
  }
  const handleAccept = async (notification) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/users/acceptrequest`, {
          senderId : user._id,
          recipientId: notification.senderId
      });
      alert("request accepted");
      console.log(response);
      
    } catch (error) {
      console.error('Error in rejecting or deleting request:', error);
    }

  }
  const getRelativeTime = (createdAt) => {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diff = Math.floor((now - notificationDate) / 1000); // Difference in seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return notificationDate.toLocaleDateString(); // Use full date for older notifications
  };

  //user isRead==false to show unread badge
  return (
    // <div className='noti-out'>
    <>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map((notification) => (
          <div className='single-noti' onClick={() => handleReadNotification(notification._id)} key={notification._id}>
             <Avtar profile={notification.profile} size="50px"/>
             <div style={{width :(notification.type === "requestGot") && "180px"}} className='noti-name-msg'>
             <p> <span className='noti-name'>{notification.name}</span>
                 {notification?.message}
                 <span className='noti-time'>{getRelativeTime(notification?.createdAt)}</span> 
              </p>
             </div>

             {(notification.type === "requestGot") && <div className='noti-btn-box'>
                  <button  onClick={() => handleAccept(notification)} className='noti-btn' >Accept</button>
                  <button style={{backgroundColor:"rgb(237, 237, 237)", color:"rgb(36, 36, 36)"}} className='noti-btn' onClick={() => handleReject(notification)}>Delete</button>
                </div>}
               
          </div>
        ))
      )}
      </>
    // </div>
  );
};

export default Notifications;
