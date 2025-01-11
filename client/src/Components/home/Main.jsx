import React, { useEffect } from 'react'
import './Main.css'
import FavoriteIcon from '@mui/icons-material/Favorite';
import About from './About';
import Feedback from './Feedback';


function Main() {

    function hanldeHover(){
        document.getElementById("main-button").style.backgroundColor ="rgb(223, 223, 223)";
        document.getElementById("icon").style.color ="red";
        document.getElementById("main-btn-text").style.color ="black";
    }
    function hanldeLeave(){
        document.getElementById("main-button").style.backgroundColor ="red";
        document.getElementById("icon").style.color ="white";
        document.getElementById("main-btn-text").style.color ="rgb(255, 240, 123)";
    }

  return (
    <div className='main-outest'>
    <div className='out-main'>
        <div className="main-box1">
            <div className="inside-main1">
                Heading in <span style={{color:"red"}}> large </span>
                <br />
                fonts
            </div>
            <div className="inside-main2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem sunt sequi eius sapiente veritatis. Ullam molestiae sequi dolorum, natus, laudantium explicabo rerum, quasi ipsa iusto 
                <br />
                 optio esse dicta vitae, fugiat vero 
                 doloribus error reiciendis quod quiasoi oifdubgvd ieruv eirub ebfiu eirue fr ebiufre bgue
            </div>
            <div className="inside-main3">
                <div id='main-button' onMouseEnter={hanldeHover} onMouseLeave={hanldeLeave} className="main-button">
                 <div className="button-icon"> 
                 <FavoriteIcon className="heartBeat" id="icon" style={{fontSize:"35px", color:"white"}} />
                 </div>
                <button id='main-btn-text'>Explore</button>
                </div>
                
            </div>
        </div>

         {/*image box */}
        <div className="main-box2">
            <img src="/home.webp" alt="" />
        </div>
    </div>

       <About />
         <Feedback /> 
    </div>
  )
}

export default Main
