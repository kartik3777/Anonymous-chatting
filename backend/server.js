const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path : './config.env'});
const app = require('./app');
// const {app, server} = require('./socket/index');
const cors = require("cors");
const getUserFromToken = require("./utils/getUserFromToken");
const User = require('./models/userModel');
const getConversation = require('./helper/getConversation');
const { ConversationModel, MessageModel } = require('./models/conversationModel');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin : 'https://anonymous-chatting-eight.vercel.app',
      methods:["GET", "POST", "PATCH", "DELETE"],
      credentials: true
  }
});
 

//socket.io leanring
// const server = new Server(app);
// const io = new Server(server);

const onlineUser = new Set();

io.on("connection", async (socket) => {

  console.log("user connected!", socket.id);

  const token = socket.handshake.auth.token;
   const user = await getUserFromToken(token);
  //  console.log(user);
//join room
    socket.join(user._id.toString());
    onlineUser.add(user._id.toString());
     io.emit("onlineUser",Array.from(onlineUser) );

     socket.on("messgaePage",  async (userID) => {
      // console.log("user id is ", userID);
       
      const userDetails = await User.findById(userID);

      const payload ={
        _id: userDetails?._id,
        name : userDetails?.name,
        email : userDetails?.email,
        profile: userDetails?.profile,
        online: onlineUser.has(userID),   
      }
      socket.emit("messasge-user", payload);

        // get previous message
        const getConversationMessage = await ConversationModel.findOne({
          "$or" : [
            {sender: user?._id, reciever: userID},
            {sender: userID, reciever: user?._id}
          ]
        }).populate('messages').sort({updatedAt: -1 })

      socket.emit('message', getConversationMessage?.messages || []);


     })

    


     //new message
     socket.on("new-message", async (data) => {
      //check conversation available or not
        let conversation = await ConversationModel.findOne({
          "$or" : [
            {sender: data?.sender, reciever: data?.reciever},
            {sender: data?.reciever, reciever: data?.sender}
          ]
        })
        // console.log("conversation",conversation);
       //if conversation not available then create it
        if(!conversation){
          const createConversation = await ConversationModel({
            sender: data?.sender,
            reciever : data?.reciever
          })
          conversation = await createConversation.save();
        }

        const message = new MessageModel({
          text: data.text,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          msgByUserId : data?.msgByUserId
        })
        const saveMessage = await message.save();
        
         const updateConversation = await ConversationModel.updateOne({_id : conversation?._id}, {
          "$push" : {messages : saveMessage?._id}
         })

        const getConversationMessage = await ConversationModel.findOne({
          "$or" : [
            {sender: data?.sender, reciever: data?.reciever},
            {sender: data?.reciever, reciever: data?.sender}
          ]
        }).populate('messages').sort({updatedAt: -1 })

        io.to(data?.sender).emit('message', getConversationMessage?.messages || [])    
        io.to(data?.reciever).emit('message', getConversationMessage?.messages || [])    
          
        //send conversation
        const conversationSender = await getConversation(data?.sender);
        const conversationReciever = await getConversation(data?.reciever);
 
        io.to(data?.sender).emit('conversation', conversationSender)    
        io.to(data?.reciever).emit('conversation', conversationReciever)    

           
        //  console.log("getConversationMessage",getConversationMessage);

     })


     socket.on('sidebar', async (currentUserId) => {
      console.log("current user", currentUserId);
     
      const conversation = await getConversation(currentUserId);
      socket.emit('conversation', conversation);
     })
 
    socket.on('seen', async (msgByUserId) => {

      let conversation = await ConversationModel.findOne({
        "$or" : [
          {sender: user?._id, reciever: msgByUserId},
          {sender: msgByUserId, reciever: user?._id}
        ]
      })
       const conversationMessageid = conversation?.messages || [];

       const updatedMessages = await MessageModel.updateMany(
        { _id : {"$in" : conversationMessageid}, msgByUserId : msgByUserId },
        {"$set" : {seen : true}}
       )

       const conversationSender = await getConversation(user?._id?.toString());
       const conversationReciever = await getConversation(msgByUserId);

       io.to(user?._id?.toString()).emit('conversation', conversationSender)    
       io.to(msgByUserId).emit('conversation', conversationReciever)    


    })



   socket.on("disconnect", () => {
    onlineUser.delete(user._id.toString());
    console.log("user disconnected", socket.id);
   })
  
  ///////////////////////////////////////////
  //joining room
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`user joined room ${room}`);
    })

   //////////////////////////////////////////////////////////////
   socket.on("message", (data) => {
         console.log(data);
       io.to(data.room).emit("recieve-message", data.message); // sendting data to a particular room

    // io.emit("recieve-message", data); // sendting data to all users

    // socket.broadcast.emit("recieve-message", data); // sendting data to all users except the one who is sending

   })


    // socket.emit("welcome", `hello welcome to learn socket.io ${socket.id}`); // this will send msg on welcome event to all 
  // socket.broadcast.emit("welcome", `user ${socket.id} join the server`);// this will send msg on welcome to all users expect one who joins the server

})

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("DB connection successfull");
})




const port = process.env.PORT || 8001;
server.listen(port, () => {
  console.log(`server is live on port ${port}`);
});
