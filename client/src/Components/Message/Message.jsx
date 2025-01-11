import "./message.css";
import MessageList from "./MessageList";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Avtar from "../avtar/Avtar";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import AddIcon from "@mui/icons-material/Add";
import uploadFile from "../../helpers/uploadFile";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { saveState } from "../../redux/localStorage";
import { store } from "../../redux/store";

function Message() {
  const [toShow, setToShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allmessage, setAllmessage] = useState([]);
  const currentMessage = useRef(null);
  const [isblocked, setIsBlocked] = useState(false);
  const [blockKiya, setBlockKiya] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [reportMsg, setReportMsg] = useState("");
  const [showReport, setShowReport] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allmessage]);

  useEffect(() => {
    if (params?.userID) {
      setShowOptions(false);
      const blockedId = user._id;
      const blockerId = params?.userID;
      axios
        .post("http://localhost:8000/api/v1/users/isblocked", {
          blockedId: blockedId,
          blockerId: blockerId,
        })
        .then((res) => {
          console.log("block checked");
          setIsBlocked(res.data.isBlocked);
          const BL = user.blockedUsers.includes(params?.userID);
          setBlockKiya(BL);
          console.log(res);
        })
        .catch((err) => {
          alert("error in checking blocklist");
          console.log(err);
        });
    }
  }, [params?.userID]);

  const socket = useSelector((state) => state.user.socket);
  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile: "",
    online: false,
    _id: "",
  });
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const onlineUser = useSelector((state) => state.user.onlineUser);
  const isOnline = onlineUser.includes(params?.userID);
  useEffect(() => {
    if (socket) {
      // console.log("socket working in message.jsx");
      socket.emit("messgaePage", params?.userID);

      socket.emit("seen", params?.userID);

      socket.on("messasge-user", (data) => {
        setUserData(data);
        // console.log("clicked user data", data);
      });

      socket.on("message", (data) => {
        setAllmessage(data);
        // console.log("message data",data);
      });
    }
    // }, [socket, params?.userID, userData])
  }, [socket, params?.userID, user]);

  const handleUploadShower = () => {
    setToShow((prev) => !prev);
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setToShow((prev) => !prev);
    setLoading(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadVideo = await uploadFile(file);
    setToShow((prev) => !prev);
    setLoading(false);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadVideo.url,
      };
    });
  };
  const removePhoto = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };
  const removeVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isblocked) {
      alert("user has blocked you, no message allowed");
      return;
    }
    if (blockKiya) {
      alert("you blocked this user, unblock to message");
      return;
    }
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socket) {
        socket.emit("new-message", {
          sender: user._id,
          reciever: params?.userID,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
      }
    }

    setMessage({
      text: "",
      imageUrl: "",
      videoUrl: "",
    });
  };
  const hanldeBlock = async () => {
    if (blockKiya) {
      //write code to unblock
      if (params?.userID) {
        const blockedId = params?.userID;
        const blockerId = user._id;
        axios
          .post("http://localhost:8000/api/v1/users/unblock", {
            blockedId: blockedId,
            blockerId: blockerId,
          })
          .then((res) => {
            if (res.data.status === "success") {
              alert("unblocked!");
              setBlockKiya(false);
              dispatch(setUser(res.data.data.user));
              saveState(store.getState());
            }
            console.log(res);
          })
          .catch((err) => {
            alert("error in blocking");
            console.log(err);
          });
      }
    } else {
      if (params?.userID) {
        const blockedId = params?.userID;
        const blockerId = user._id;
        axios
          .post("http://localhost:8000/api/v1/users/block", {
            blockedId: blockedId,
            blockerId: blockerId,
          })
          .then((res) => {
            alert("blocked!");
            setBlockKiya(true);
            dispatch(setUser(res.data.data.user));
            saveState(store.getState());
            console.log(res.data);
          })
          .catch((err) => {
            alert("error in blocking");
            console.log(err);
          });
      }
    }
  };
  const handleReport = async () => {
    if (params?.userID) {
      const reporter = user._id;
      const kiskiReport = params?.userID;
      axios
        .post("http://localhost:8000/api/v1/users/report", {
          reporter: reporter,
          kiskiReport: kiskiReport,
          reportMessage: reportMsg,
        })
        .then((res) => {
          alert("reported!");
          console.log(res.data);
          setShowReport(false);
        })
        .catch((err) => {
          alert("error in reporting");
          console.log(err);
        });
    }
  };
  const handleClearChat = async () => {
    const userId1 = params?.userID;
    const userId2 = user._id;
    axios
      .post("http://localhost:8000/api/v1/users/clearchat", {
        userId1,
        userId2,
      })
      .then((res) => {
        alert("Deleted!");
        console.log(res.data);
        setShowOptions(false);
        window.location.reload();
      })
      .catch((err) => {
        alert("error in deleting");
        console.log(err);
      });
  };
  const handleSendRequest = async () => {
    axios
      .post("http://localhost:8000/api/v1/users/sendrequest", {
        senderId: user._id,
        recipientId: params?.userID,
      })
      .then((res) => {
        alert("requested!");
        console.log(res.data);
        setShowOptions(false);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };
  function handleThreedot() {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  }
  function handleReportMessage(e) {
    setReportMsg(e.target.value);
  }
  return (
    <div className="message-outer">
      <div className="message-side-out">
        <MessageList />
      </div>
      {params?.userID ? (
           <div className="conversation-out">
           <div className="message-area-heading">
             <div className="head-left">
               <Avtar profile={userData.profile} size={"40px"} />
               <div className="msg-page-name-etc">
                 <p style={{ color: "navy" }}>{userData.name}</p>
                 <p style={{ color: isOnline && "blue" }}>
                   {isOnline ? "Online" : "Offline"}
                 </p>
               </div>
             </div>
   
             {isblocked && <div className="chat-head-msg"> User blocked you</div>}
             {blockKiya && (
               <div className="chat-head-msg"> You blocked this user</div>
             )}
   
             <MoreVertIcon onClick={handleThreedot} className="three-dot" />
             {showOptions && (
               <div className="options-threedot">
                 <div onClick={hanldeBlock} className="option-block">
                   {" "}
                   {blockKiya ? "Unblock" : "Block"}
                 </div>
                 <div
                   onClick={() => setShowReport(!showReport)}
                   className="option-block"
                 >
                   Report
                 </div>
                 <div onClick={handleClearChat} className="option-block">
                   Delete
                 </div>
                 <div onClick={handleSendRequest} className="option-block">
                   Request
                 </div>
               </div>
             )}
             {showReport && (
               <div className="report-box">
                 <p>
                   * Report will be forwarded to admin then admin will take action.
                 </p>
                 <h4>Why are you Reporting?</h4>
                 <textarea
                   onChange={handleReportMessage}
                   name=""
                   id="report-msg"
                 ></textarea>
                 <div className="report-btns">
                   <button onClick={handleReport}>Report</button>
                   <button
                     onClick={() => setShowReport(false)}
                     style={{
                       color: "rgb(236, 236, 236)",
                       backgroundColor: "black",
                     }}
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             )}
           </div>
           <div className="message-area-main-outer">
             {/* showing all messages here  */}
             <div className="main-msg-show">
               {allmessage.map((msg, index) => {
                 return (
                   <div
                     ref={currentMessage}
                     style={{
                       width: "inherit",
                       paddingBottom: "5px",
                       display: "flex",
                       justifyContent: `${
                         user._id === msg.msgByUserId ? "flex-end" : "flex-start"
                       }`,
                     }}
                   >
                     <div
                       className="text-cont"
                       style={{
                         marginRight: "0px",
                         backgroundColor:
                           user._id === msg.msgByUserId && "rgb(79, 105, 146)",
                       }}
                     >
                       <div>
                         {msg?.imageUrl && (
                           <img
                             style={{ objectFit: "scale-down" }}
                             width={200}
                             height={200}
                             src={msg.imageUrl}
                             alt=""
                           />
                         )}
                         {msg?.videoUrl && (
                           <video
                             style={{ objectFit: "scale-down" }}
                             width={200}
                             height={200}
                             src={msg.videoUrl}
                             alt=""
                           />
                         )}
                       </div>
                       <p>{msg.text}</p>
                       <div className="time-read">
                         <p>{moment(msg.createdAt).format("hh:mm")}</p>
                         {user._id === msg.msgByUserId && (
                           <DoneAllIcon
                             style={{ color: msg.seen ? "aqua" : "lightgrey" }}
                             fontSize="10"
                           />
                         )}
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
   
             {/* image preview */}
             {message.imageUrl && (
               <div className="image-shower-outer">
                 <ClearIcon
                   onClick={removePhoto}
                   style={{
                     position: "absolute",
                     top: "10px",
                     right: "10px",
                     cursor: "pointer",
                   }}
                 />
   
                 <img
                   style={{ objectFit: "scale-down" }}
                   height={300}
                   width={300}
                   src={message.imageUrl}
                   alt="upload image"
                 />
               </div>
             )}
             {/* video preview */}
             {message.videoUrl && (
               <div className="image-shower-outer">
                 <ClearIcon
                   onClick={removeVideo}
                   style={{
                     position: "absolute",
                     top: "10px",
                     right: "10px",
                     cursor: "pointer",
                   }}
                 />
                 <video
                   style={{ objectFit: "scale-down" }}
                   height={300}
                   width={300}
                   src={message.videoUrl}
                   alt="upload video"
                   controls
                   muted
                   autoPlay
                 />
               </div>
             )}
             {loading && <h3>Loading.....</h3>}
           </div>
           {/* handle this uploader position */}
           {toShow && (
             <div className="uploader">
               <form>
                 <label htmlFor="imageUploader" className="image-upload">
                   <ImageIcon
                     style={{ marginLeft: "10px", color: "lightGreen" }}
                   />
                   <p>Image</p>
                 </label>
                 <input
                   onChange={handleUploadImage}
                   style={{ display: "none" }}
                   type="file"
                   name="imageUploader"
                   id="imageUploader"
                 />
   
                 <label htmlFor="videoUploader" className="image-upload">
                   <VideocamIcon
                     style={{ marginLeft: "10px", color: "darkViolet" }}
                   />
                   <p>Video</p>
                 </label>
                 <input
                   onChange={handleUploadVideo}
                   style={{ display: "none" }}
                   type="file"
                   name="videoUploader"
                   id="videoUploader"
                 />
               </form>
             </div>
           )}
           <div className="sender-outer">
             <AddIcon
               onClick={handleUploadShower}
               fontSize="medium"
               style={{
                 marginLeft: "10px",
                 cursor: "pointer",
                 background: "rgb(237, 237, 237)",
                 padding: "5px",
                 borderRadius: "50%",
               }}
             />
             <form onSubmit={handleSendMessage} className="type-message">
               <input
                 onChange={handleChange}
                 value={message.text}
                 placeholder="Type your message here..."
                 type="text"
                 name=""
                 id=""
               />
               <button type="submit" className="send-button">
                 <SendIcon />
               </button>
             </form>
           </div>
         </div>
      ):(
          <div className="when-empty">Start new conversation</div>
      )
      }
     
    </div>
  );
}

export default Message;
