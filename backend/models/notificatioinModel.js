const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'main',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderId:{
      type: mongoose.Schema.ObjectId,
      required: true
    },
    profile:{
      type : String
    },
    name:{
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String, // e.g., "requestAccepted"
      default: 'requestAccepted',
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model('Notification', notificationSchema);
module.exports = NotificationModel;
