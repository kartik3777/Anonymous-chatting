import React, { useState } from 'react'
import axios from 'axios'
import './feedback.css'
import { useSelector } from "react-redux";

function Feedback() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [afterSubmit, setAfterSubmit] = useState("");
    const user = useSelector((state) => state.user);

    const handleFeedback = async () => {
        try {
          const response = await axios.post("http://localhost:8000/api/v1/users/feedback", {
            userId: user._id,
            message,
            subject
          })
          console.log(response.data);
          alert("submitted");
          setMessage("");
          setSubject("");
          setAfterSubmit(response.data.message);
          
        } catch (error) {
             console.log('error in feedback===================');
             console.log(error);
             console.log('====================================');
        }
    }
    function handleSubChange(e){
        setSubject(e.target.value);
    }
    function handleMsgChange(e){
        setMessage(e.target.value);
    }
  return (
    <div className='feed-out'>
        <h3 style={{color:"white"}}>Feedback form</h3>
        {
            afterSubmit? <p style={{color:"white"}}>{afterSubmit}</p>:
             <div className='feed-content'>
                <div className='input-box'>
                  <input onChange={handleSubChange} type="text" name="" id="feed-sub" placeholder='Subject' />
                  <textarea onChange={handleMsgChange} name="" id="feed-msg" placeholder='Write your feedback'></textarea>
                </div>
                <button onClick={handleFeedback}>Submit</button>
             </div>
        }        
    </div>
  )
}

export default Feedback
