const { ConversationModel } = require("../models/conversationModel");


const getConversation = async(currentUserId) => {
    if(currentUserId){
        const currentUserConversation = await ConversationModel.find({
          "$or" : [
            {sender : currentUserId},
            {reciever : currentUserId}
          ]
        }).sort({ updatedAt : -1}).populate('messages').populate('sender').populate('reciever')
        // console.log('conversation', currentUserConversation);
         
        const conversation = currentUserConversation.map((conv) => {
          const unSeenMsg = conv.messages.reduce((preve, curr) => {
              
            const msgByUserId = curr?.msgByUserId?.toString();
            if(msgByUserId !== currentUserId){
              return preve +(curr?.seen ? 0: 1)
            }else{
              return preve;
            }
}, 0);

          return {
            _id : conv?._id,
            sender : conv?.sender,
            reciever : conv?.reciever,
            unseenMsg : unSeenMsg,
            lastMsg : conv.messages[conv?.messages?.length -1]
          }
        })
  
        return conversation
      }else{
        return []
      }
}

module.exports = getConversation;