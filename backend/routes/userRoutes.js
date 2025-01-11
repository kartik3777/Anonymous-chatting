const express = require("express");
const userController = require('./../controllers/userControllers');
const authController = require("./../controllers/authController");

const router = express.Router(); //this is a middleware

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/sendOtp").post(authController.sendOtp);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router.route("/updateMyPassword").patch(authController.protect, authController.updatePassword);
router.route("/block").post(authController.block);
router.route("/report").post(authController.report);
router.route("/unblock").post(authController.unblock);
router.route("/isblocked").post(authController.isblocked);



router
.route("/")
.get(authController.protect ,userController.getAllUsers) // protected route
.post(userController.createUser);

router.route("/updateMe").patch(authController.protect, userController.updateMe);
router.route("/deleteMe").delete(authController.protect, userController.deleteMe);

router
.route('/:id')
.get(userController.getOneUser)
.patch(userController.updateUser)
.delete(authController.protect,authController.restrictTo('admin'),userController.deleteUser);

router
.route("/top-5-users")
.get(userController.topUsers, userController.getAllUsers);

router.route("/clearchat").post(userController.clearChat);
router.route("/addnotification").post(userController.addNotification);
router.route("/markread").post(userController.markAsRead);
router.route("/getnotifications/:userId").get(userController.getNotifications);
router.route("/sendrequest").post(userController.sendRequest);
router.route("/acceptrequest").post(userController.acceptRequest);
router.route("/rejectrequest").post(userController.rejectRequest);
router.route("/feedback").post(userController.feedback);
router.route("/getAcceptedUsers/:userId").get(userController.getAcceptedUsers); 
router.route("/removeAccepted").post(userController.removeAcceptedUser); 
router.route("/deletenotification/:notificationId").delete(userController.deleteNotification);



module.exports = router;

