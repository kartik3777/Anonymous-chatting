const User = require('./../models/userModel');
const APIfeature = require('./../utils/apiFeatures');
const { MessageModel, ConversationModel } = require('../models/conversationModel'); // Adjust the path as needed
const NotificationModel = require("../models/notificatioinModel");
const sendEmail = require("../utils/email");


//clearing chat for both the users
exports.clearChat = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
      return res.status(400).json({
        status: 'fail',
        message: 'Both userId1 and userId2 are required.',
      });
    }

    // Find the conversation between the two users
    const conversation = await ConversationModel.findOne({
      $or: [
        { sender: userId1, reciever: userId2 },
        { sender: userId2, reciever: userId1 },
      ],
    });

    if (!conversation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Conversation not found.',
      });
    }

    // Delete all messages associated with the conversation
    await MessageModel.deleteMany({ _id: { $in: conversation.messages } });

    // Delete the conversation document itself
    await ConversationModel.findByIdAndDelete(conversation._id);

    res.status(200).json({
      status: 'success',
      message: 'Chat deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({
      status: 'fail',
      message: 'There was an error deleting the chat. Please try again later.',
    });
  }
};
//notifications related
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true });
    res.status(200).json({ status: 'success', message: 'Notification marked as read.' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Error marking as read.' });
  }
};
exports.addNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID and message are required.',
      });
    }

    const notification = await NotificationModel.create({
      userId,
      message,
    });

    res.status(201).json({
      status: 'success',
      data: notification,
    });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Error adding notification.',
    });
  }
};
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is required.',
      });
    }

    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Error fetching notifications.',
    });
  }
};

//make a delete notification route
exports.deleteNotification = async (req, res) => {
  try {
    const {notificationId} = req.params;

    if (!notificationId) {
      return res.status(400).json({
        status: "fail",
        message: "Notification ID is required.",
      });
    }
    
    // Find and delete the notification
    const deletedNotification = await NotificationModel.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({
        status: "fail",
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully.",
      data: {
        deletedNotification,
      },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      status: "fail",
      message: "There was an error deleting the notification. Please try again later.",
    });
  }
};

//requests and notification adding
//sender is always who is taking action
//reciever is who will get notified
exports.sendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    if (!senderId || !recipientId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Both senderId and recipientId are required.',
      });
    }
    const sender= await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        status: 'fail',
        message: 'sender not found.',
      });
    }
    const x = await User.findById(recipientId);
    if(x.requested.includes(senderId)){
      return res.status(500).json({
        status: 'fail',
        message: 'You have already requested, multiple requests not allowed.',
      });
    }
    if(x.accepted.includes(senderId)){
      return res.status(500).json({
        status: 'fail',
        message: 'User has already revealed their identiy, can not request now.',
      });
    }
    // Add senderId to recipient's 'requested' array
    const recipient = await User.findByIdAndUpdate( //add request in reciever array
      recipientId,
      { $addToSet: { requested: senderId } }, // Prevent duplicates
      { new: true }
    );
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipient not found.',
      });
    }
    // Add notification for recipient
    await NotificationModel.create({
      name: sender.name,
      profile:sender.profile,
      userId: recipientId,
      senderId: sender._id,
      type:"requestGot", //use this to display request 
      message: `requested you to reveal your identity.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Request sent successfully.',
    });
  } catch (error) {
    console.error('Error sending request:', error);
    res.status(500).json({
      status: 'fail',
      message: 'There was an error sending the request.',
    });
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    const { recipientId, senderId } = req.body;

    if (!recipientId || !senderId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Both recipientId and senderId are required.',
      });
    }
    const recipient= await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'recipient not found.',
      });
    }
    // Move senderId from 'requested' to 'accepted'
    const sender = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { requested: recipientId },
        $addToSet: { accepted: recipientId },
      },
      { new: true }
    );
    if (!sender) {
      return res.status(404).json({
        status: 'fail',
        message: 'sender not found.',
      });
    }
    // Add notification for the reciever
    await NotificationModel.create({
      name: sender.name,
      profile: sender.profile,
      type: "requestAccepted",
       senderId: senderId,
      userId: recipientId,
      message: `accepted your request.`,
    });

    //update sender's notification
    await NotificationModel.findOneAndUpdate(
      { userId: senderId, type: "requestGot", senderId: recipientId },
      { 
        type: "acceptKiya", 
        message: "can now see your identity." 
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Request accepted successfully.',
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({
      status: 'fail',
      message: 'There was an error accepting the request.',
    });
  }
};
exports.rejectRequest = async (req, res) => {
  try {
    const { recipientId, senderId } = req.body;

    if (!recipientId || !senderId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Both recipientId and senderId are required.',
      });
    }
    const recipient= await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'recipient not found.',
      });
    }

    // remove request of reciever(who sended) from my req array
    const sender = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { requested: recipientId }
      },
      { new: true }
    );
    if (!recipient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Recipient not found.',
      });
    }
    // Add notification for the reciver
    await NotificationModel.create({
      name: sender.name,
      profile: sender.profile,
      senderId: senderId,
      type: "requestRejected", //use this to display notifications
      userId: recipientId, //reciever (who requested) got rejected so he shoudld be notified
      message: `rejected your request.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Request rejected successfully.',
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({
      status: 'fail',
      message: 'There was an error rejecting the request.',
    });
  }
};

exports.getAcceptedUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: 'fail',
        message: 'User ID is required.',
      });
    }

    // Find the user and populate the accepted array with user data
    const user = await User.findById(userId).populate({
      path: 'accepted',
      select: 'name email profile gender branch', // Specify fields you want to return
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: user.accepted,
    });
  } catch (error) {
    console.error('Error fetching accepted users:', error);
    res.status(500).json({
      status: 'fail',
      message: 'There was an error fetching the accepted users.',
    });
  }
};
exports.removeAcceptedUser = async (req, res) => {
  try {
    const { userId, acceptedUserId } = req.body;

    if (!userId || !acceptedUserId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Both userId and acceptedUserId are required.',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { accepted: acceptedUserId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User removed from accepted list.',
    });
  } catch (error) {
    console.error('Error removing accepted user:', error);
    res.status(500).json({
      status: 'fail',
      message: 'Error removing user from accepted list.',
    });
  }
};


//feedback
exports.feedback = async (req, res) => {
  try {
    const { userId, subject, message } = req.body; // Destructure inputs

    // Validate required fields
    if (!userId || !subject || !message) {
      return res.status(400).json({
        status: "fail",
        message: "userId, subject ID, and message are required."
      });
    }

    // Find the reporter by ID
    const reporterUser = await User.findById(userId);
    if (!reporterUser) {
      return res.status(404).json({
        status: "fail",
        message: "user not found."
      });
    }

    // Send email to admin with report details
    await sendEmail({
      email: "kartikkartik29957@gmail.com", // Admin's email
      subject: `Feedback- ${subject}`,
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "Thanks for submitting, your feedback will help us to improve.",
    });
  } catch (error) {
    console.error("Error in feedback: ", error);
    res.status(500).json({
      status: "fail",
      message: "There was an error in submitting feedback. Please try again later.",
    });
  }
}; 


//others
exports.topUsers = (req, res, next) =>{
  req.query.limit = '5';
  req.query.sort = 'rollno';
  req.query.fields = 'name,rollno';
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj ={};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
}

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false});

  res.status(200).json({
    status:"success",
    message: "You have successfully deleted your account"
  })
}

exports.updateMe = async (req, res, next) => {
 console.log('====================================');
 console.log(req.body);
 console.log('====================================');
  //checking the user dont want to update password
  if(req.body.password || req.body.confirmPassword){
    res.status(400).json({
      status:"fail",
      message : "You are at the wrong route, please go to /updateMyPassword to update the password"
    })
  }
//update user document

 const filteredBody = filterObj(req.body, 'name', 'email', 'profile');
  const updatedUser = await User.findByIdAndUpdate(req.body.id, filteredBody, { // we cant pass req.body here bcoz of security user should not be able to change token,role etc.
  new: true,
  runValidators: true
 })

res.status(200).json({
  status:"success",
  data:{
     user : updatedUser
  }
})
}

exports.getAllUsers = async (req, res) => {
  try{
  //  const users = await User.find();  //out it if password will not hided or worok
   const features = new APIfeature(User.find(),req.query)
   .filter()
   .sort()
   .limitFields()
   .paginate();

    const users = await features.query;


    res.status(200).json({
      status:"success",
      results: users.length,
      data:{
        users: users
      }
    })
  }catch (err) {
    res.status(400).json({
        status: "fail",
        message: err.message // Use err.message to get the error message
    });
}
}

  exports.getOneUser = async (req, res) => {
    try{
      const OneUser = await User.findById(req.params.id);
      res.status(200).json({
        status:"message",
        data:{
          OneUser
        }
      })
    }catch(err){
      res.status(400).json({
        status:"fail",
        message: err
      })
    }
  }

  exports.updateUser = async (req, res) => {
    try{
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
      res.status(200).json({
        status:"message",
        data:{
          updatedUser
        }
      })
    }catch(err){
      res.status(400).json({
        status:"fail",
        message: err
      })
    }
  }
  
  exports.deleteUser = async (req, res) => {
    try{
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      res.status(204).json({
        status:"message",
        data:{
          deletedUser
        }
      })
    }catch(err){
      res.status(400).json({
        status:"fail",
        message: err
      })
    }
  }

  exports.createUser = async (req, res) => {
  try{
    const newUser = await User.create(req.body);
    res.status(201).json({
      status:"success",
      data: {
        newUser : newUser
      }
    })
  }catch(err){
    res.status(400).json({
      status: "fail",
      message: err,
      hint:"error in creating user"
    })
  }

  }
