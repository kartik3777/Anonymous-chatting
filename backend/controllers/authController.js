
const User = require('./../models/userModel');
const jwt = require("jsonwebtoken");
const {promisify} = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const getUserFromToken = require("../utils/getUserFromToken");



const signToken = id =>{
   return jwt.sign({ id }, process.env.JWT_SECRET,{
    expiresIn : process.env.JWT_EXPIRSE_IN
  })
};
const cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOCKIE_EXPIRES_IN *24*60*60*1000),
  // secure: true,
  httpOnly: true
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
 //sending token via cookie
  res.cookie('jwt', token, cookieOptions);
  //remove the password from output
  user.password = undefined;

  res.status(statusCode).json({
    status:"success",
    token,
    data: {
      user 
    }
  })
}

exports.block = async (req, res) => {
  try {
    const { blockerId, blockedId } = req.body; // Expecting blocker and blocked user IDs

    if (!blockerId || !blockedId) {
      return res.status(400).json({
        status: "fail",
        message: "Both blockerId and blockedId are required."
      });
    }

    // Find the blocker and update their blockedUsers list
    const updatedBlocker = await User.findByIdAndUpdate(
      blockerId,
      { $addToSet: { blockedUsers: blockedId } }, // Add blockedId to the array if not already present
      { new: true, runValidators: true }
    );
 
    if (!updatedBlocker) {
      return res.status(404).json({
        status: "fail",
        message: "Blocker not found."
      });
    }

    res.status(200).json({
      status: "success",
      message: `User ${blockedId} has been blocked by user ${blockerId}.`,
      data: {
        user: updatedBlocker
      }
    });
  } catch (error) {
    console.error("Error blocking a person:", error);
    res.status(400).json({
      status: "fail",
      message: "There was an error in blocking the person. Please try again later!"
    });
  }
};

exports.unblock = async (req, res) => {
  try {
    const { blockerId, blockedId } = req.body; // Expecting blocker and blocked user IDs

    if (!blockerId || !blockedId) {
      return res.status(400).json({
        status: "fail",
        message: "Both blockerId and blockedId are required."
      });
    }

    // Find the blocker and update their blockedUsers list by removing blockedId
    const updatedBlocker = await User.findByIdAndUpdate(
      blockerId,
      { $pull: { blockedUsers: blockedId } }, // Remove blockedId from blockedUsers array
      { new: true, runValidators: true }
    );

    if (!updatedBlocker) {
      return res.status(404).json({
        status: "fail",
        message: "Blocker not found."
      });
    }

    res.status(200).json({
      status: "success",
      message: `User ${blockedId} has been unblocked by user ${blockerId}.`,
      data: {
        user: updatedBlocker
      }
    });
  } catch (error) {
    console.error("Error unblocking a person:", error);
    res.status(500).json({
      status: "fail",
      message: "There was an error in unblocking the person. Please try again later!"
    });
  }
};

exports.isblocked = async (req, res) => {
  try {
    const { blockerId, blockedId } = req.body; // Expecting blocker and blocked user IDs

    if (!blockerId || !blockedId) {
      return res.status(400).json({
        status: "fail",
        message: "Both blockerId and blockedId are required."
      });
    }

    // Find the blocker by ID and select the blockedUsers array
    const blocker = await User.findById(blockerId).select('blockedUsers');

    if (!blocker) {
      return res.status(404).json({
        status: "fail",
        message: "Blocker not found."
      });
    }

    // Check if the blockedUsers array exists and if blockedId is in the array
    const isBlocked = blocker.blockedUsers && Array.isArray(blocker.blockedUsers)
      ? blocker.blockedUsers.includes(blockedId)
      : false;

    res.status(200).json({
      status: "success",
      isBlocked
    });
  } catch (error) {
    console.error("Error in isBlocked: ", error);
    res.status(500).json({
      status: "fail",
      message: "Error in checking block status."
    });
  }
};
exports.report = async (req, res) => {
  try {
    const { reporter, kiskiReport, reportMessage } = req.body; // Destructure inputs

    // Validate required fields
    if (!reporter || !kiskiReport || !reportMessage) {
      return res.status(400).json({
        status: "fail",
        message: "Reporter ID, kiskiReport ID, and report message are required."
      });
    }

    // Find the reporter by ID
    const reporterUser = await User.findById(reporter);
    if (!reporterUser) {
      return res.status(404).json({
        status: "fail",
        message: "Reporter not found."
      });
    }

    // Find the user being reported by ID
    const reportedUser = await User.findById(kiskiReport);
    if (!reportedUser) {
      return res.status(404).json({
        status: "fail",
        message: "Reported user not found."
      });
    }

    // Send email to admin with report details
    await sendEmail({
      email: "kartikkartik29957@gmail.com", // Admin's email
      subject: `${reporterUser.name} (ID: ${reporter}) reported ${reportedUser.name} (ID: ${kiskiReport})`,
      message: reportMessage,
    });

    res.status(200).json({
      status: "success",
      message: "User has been reported. Admin will review your report.",
    });
  } catch (error) {
    console.error("Error reporting user:", error);
    res.status(500).json({
      status: "fail",
      message: "There was an error in reporting. Please try again later.",
    });
  }
}; 

//check if the otp send and entered are same or not in frontend;
exports.sendOtp = async (req, res, next) => {
  try {
      // Get user based on posted email
      const user = await User.findOne({ email: req.body.email });
      //first add the user in db then signup 
      if (!user) {
          return res.status(404).json({
              status: "fail",
              message: "There is no user registered with this email"
          });
      }

      // Generate OTP
      let OTP = '';
      function generateOTP() {
          const digits = '0123456789';
          const len = digits.length;
          for (let i = 0; i < 4; i++) {
              OTP += digits[Math.floor(Math.random() * len)];
          }
      }
      generateOTP();
      console.log("OTP of 4 digits: ", OTP);

      // Send success response
      res.status(200).json({
          status: "success",
          message: "OTP sent to email successfully!!!",
          data: {
              otp: OTP
          }
      });
  } catch (error) {
      // Handle the error
      console.error("Error sending OTP:", error);
      res.status(400).json({
          status: "fail",
          message: "There was an error in sending OTP. Please try again later!"
      });
  }
};


//sign up with email is done , convert email to rollno
exports.signup = async (req, res) => {
  try{
    // const newUser = await User.create(req.body);
   const {email, password, confirmPassword, profile} = req.body;

  if(!email || !password){
    res.status(400).json({
      status: "fail",
      message: "please enter complete details"
    })
    return;
   }

   const user = await User.findOne({email});
   if(!user){
    res.status(401).json({
      status: "fail",
      message: "You are not registered!!!"
    })
    return;
   }
   if(password != confirmPassword){
    res.status(401).json({
      status: "fail",
      message: "password are not same, please enter same password in both!!!"
    })
    return;
   }
   user.password = password;
   user.confirmPassword = confirmPassword;
   user.profile = profile;
   await user.save();

    createSendToken(user, 201, res);

  }catch(err){
    res.status(400).json({
      status: "fail",
      message: err,
      hint:"error in creating user"
    })
  }
   
}

exports.login = async (req, res) => {
   const {email, password}  = req.body;

   if(!email || !password){
    res.status(400).json({
      status: "fail",
      message: "please enter complete details"
    })
    return;
   }

   const user = await User.findOne({email}).select('+password');
   console.log(user);
  //  const correct = await user.correctPassword(password, user.password); 

   if(!user || !(await user.correctPassword(password, user.password))){
    res.status(401).json({
      status: "fail",
      message: "Incorrect email or passworrd"
    })
    return;
   }

   //if everything is ok then send token to client
   createSendToken(user, 200, res);
}


//we also have to reload manually from frontend by location.reload(true);
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(0), // Set expiration to a past date
    httpOnly: true,       // Prevent client-side access
    sameSite: 'Strict',   // Restrict cross-site requests
  });

  res.status(200).json({
    status: 'success',
    message: 'User is logged out',
  });
};

exports.protect = async (req, res, next) => {
  console.log("req.cookies", req.cookies);
  try{
    let token;
    if(req.cookies.jwt){
      token = req.cookies.jwt;
    }
    console.log("token", token);
    if(!token){
      res.status(401).json({
        status: "fail",
        message: "You are not logged in , please login to get access"
      })
      return;
    }

const freshUser = getUserFromToken(token);
  //grant access to protected routes
  req.user = freshUser;
  next();

  }catch(err){
    res.status(401).json({
      status: "fail",
      message: "something wrong with token"
    })
  }
  
}
exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.jwt){
      try{
       //verificating token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
   
  //check if user still exists
  const freshUser = await User.findById(decoded.id);
  if(!freshUser){
    return next();
  }
   //check if user changes password after token was issued
  if(freshUser.changedPasswordAfter(decoded.iat)){
    return next();
  }
  //grant access to protected routes
  req.user = freshUser;
  next();
} catch(err){
  return next();
}
  }
   next();
}

exports.restrictTo = (...roles) => {
  return (req, res, next) =>{
   if(!roles.includes(req.user.role)){
    res.status(403).json({
      status: "fail",
      message: "You can not perform this action"
    })
   }
   next();

  }
}

exports.forgotPassword = async (req, res, next) => {
  //get user based on posted email
   const user = await User.findOne({email: req.body.email});
   if(!user){
    res.status(404).json({
      status: "fail",
      message: "there is no user registered with this email"
    })
   }
   
  //generate random reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave : false }); // it will not give validation error 

  //send it back to user email address
  const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
  // const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
  const message = `forgot your password you idiot ? submit a patch request with new password and confirm it  to: ${resetUrl}. \n if you dont forgot then please ignore this `;

   try {
    await sendEmail({
      email : user.email,
      subject: "your password reset token (valid for 10 minutes)",
      message
    })
  
    res.status(200).json({
      status: "success",
      message:"token sent to email successfully!!!"
    })
   } catch (error) {
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save({ validateBeforeSave : false }); // it will not give validation error 
    
     res.status(500).json({
      status:"fail",
      message:"There was an error in sending email ,Try again later!"
     })

   }
}
exports.resetPassword = async (req, res, next) => {
  try {
      // get user based on the token
      const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt : Date.now()}});
    //if token is not expired and user still exists then set the password
     if(!user){
      res.status(400).json({
        status:"fail",
        message:"Token is invalid or ix expired"
       })
     }
  
    //update changedPasswordAt property of user
     user.password = req.body.password;
     user.confirmPassword = req.body.confirmPassword;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
      await user.save();
    //log the user in , send jwt
    createSendToken(user, 201, res);
    
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "reset password is not working correctly",
      error
    })
  }


}

// only people who are loged in can update their password
exports.updatePassword = async (req, res, next) => {
  try {
    //get the user 
    console.log(req.body);
    const user = await User.findById(req.user.id).select('+password'); // we can not use findbyidandupdate here we should not use it anything related to password
 //check if posted password is correct
   console.log(user.email);
    if(!(await user.correctPassword(req.body.currentPassword, user.password))){
      res.status(401).json({
        status: "fail",
        message: "password is not correct, please enter correct password",
      })
    }
    //if so, update the password
    
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    await user.save();

    //login user and send jwt
    createSendToken(user, 201, res);
    
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "fail",
      message: "update password is not working correctly",
      error: error
    })
  }

}

// exports.signup = async (req, res) => {
//     if(req.body.gender == "male"){
//         try{
//             const newUser = await User.create(req.body);
//             res.status(201).json({
//               status:"success",
//               message:"user is created!!",
//               data: {
//                 newUser : newUser
//               }
//             })
//           }catch(err){
//             res.status(400).json({
//               status: "fail",
//               message: err,
//               hint:"error in creating user"
//             })
//           }
//     }else if(req.body.gender == "female"){
//         try{
//             const newUser = await Girls.create(req.body);
//             res.status(201).json({
//               status:"success",
//               message:"girl is created!!",
//               data: {
//                 newUser : newUser
//               }
//             })
//           }catch(err){
//             res.status(400).json({
//               status: "fail",
//               message: err,
//               hint:"error in creating girl "
//             })
//           }
//     }else{
//         res.status(400).json({
//             status:"fail",
//             message:"please specify the gender"
//         })
//     }
   
// }