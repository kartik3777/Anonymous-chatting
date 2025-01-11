import React from 'react'
import './Dashboard.css'
import Sidebar from '../Components/Sidebar/Sidebar'
import { Outlet} from 'react-router-dom';


function Dashboard() {
  return (
    <div className='dash-outer'>
       <Sidebar /> 
       <div className="content-outer">
         <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
