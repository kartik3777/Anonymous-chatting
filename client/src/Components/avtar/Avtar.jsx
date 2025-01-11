import React from 'react'
import './avtar.css';

function Avtar(props) {

  return (
    <div style={{height:props.size, width:props.size}} className="profile-image">
         <img  style={{height:props.size, width:props.size}} src={props.profile} alt="" />
         {props.isOnline && <span className="status-dot"></span>}
         </div>
  )
}

export default Avtar
