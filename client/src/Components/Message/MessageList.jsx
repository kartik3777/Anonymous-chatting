import React, { useEffect, useState } from "react";
import "./messagelist.css";
import { useSelector } from "react-redux";
import Avtar from "../avtar/Avtar";
import { NavLink, useNavigate } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import moment from "moment";
import PhotoIcon from '@mui/icons-material/Photo';
import VideoFileIcon from '@mui/icons-material/VideoFile';


function MessageList() {
  const socket = useSelector((state) => state.user.socket);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const onlineUser = useSelector((state) => state.user.onlineUser);

  // const isOnline = onlineUser.includes();
  const [alluser, setAllUser] = useState([]);

  useEffect(() => {
    console.log("user in sidebar", user);
    if (socket) {
      socket.emit("sidebar", user._id);

      socket.on("conversation", (data) => {
        // console.log("conversation data coming", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser.sender?._id === conversationUser?.reciever?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.reciever?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.reciever,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        console.log("conversation data after", conversationUserData);
        setAllUser(conversationUserData);
      });
    }
  }, [socket, user]);

  return (
   <>
      <div className="message-heading">
        <h2>Messages</h2>
      </div>
      <div className="msg-list-boxes">
        {alluser.map((conv, index) => {
          const isOnline = onlineUser.includes(conv?.userDetails?._id);
          return (
            <NavLink
              to={"/nav/message/" + conv?.userDetails?._id}
              key={conv?._id}
            >
              <div className="msg-list-box" key={conv?._id}>
                <Avtar profile={conv?.userDetails?.profile}
                  isOnline={isOnline}
                  size="45px" />
                <div className="msg-name-etc">
                  <div className="timeAndName">
                    <p style={{ color: "navy" }}>{conv?.userDetails?.name}</p>
                    <p className="timeInSide">
                      {(() => {
                        const createdAt = moment(conv?.lastMsg?.createdAt);
                        const now = moment();

                        if (createdAt.isSame(now, "day")) {
                          // Show time if the message is from today
                          return createdAt.format("hh:mm A");
                        } else if (
                          createdAt.isSame(now.subtract(1, "day"), "day")
                        ) {
                          // Show "Yesterday" if the message is from yesterday
                          return "Yesterday";
                        } else {
                          // Show date for older messages
                          return createdAt.format("DD/MM/YYYY");
                        }
                      })()}
                    </p>
                  </div>
                  <div className="lst-msg-view">
                    {
                      (conv?.lastMsg?.text && conv?.lastMsg?.msgByUserId === user?._id) && <DoneAllIcon
                      style={{ color: conv?.lastMsg?.seen ? "blue" : "grey" }}
                      fontSize="10"
                    />
                    }
                    {
                      conv?.lastMsg?.imageUrl && <PhotoIcon
                      style={{ color: conv?.lastMsg?.seen ? "blue" : "grey" }}
                      fontSize="10"
                    />
                    }
                    {
                      conv?.lastMsg?.videoUrl && <VideoFileIcon
                      style={{ color: conv?.lastMsg?.seen ? "blue" : "grey" }}
                      fontSize="10"
                    />
                    }
                      {conv?.lastMsg?.imageUrl && <p style={{ fontSize: "13px" }}>Image</p>}
                      {conv?.lastMsg?.videoUrl && <p style={{ fontSize: "13px" }}>Video</p>}
                      <p style={{ fontSize: "13px" }}>
                      {conv?.lastMsg?.text?.length > 33
                        ? `${conv?.lastMsg?.text.substring(0, 33)}...`
                        : conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {conv?.unseenMsg > 0 && (
                  <div className="unseen">{conv?.unseenMsg}</div>
                )}
              </div>
            </NavLink>
          );
        })}
      </div>
      </>
  );
}

export default MessageList;
