const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      default: "robot"
    },
    rollno: {
      type: String,
      required: [true, "student must have roll number"],
      default: "123456",
    },
    profile: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    branch: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'boy', 'girl'],
      default: 'user'
    },
    password: {
      type: String,
      select: false // now this.password will not work
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not the same"
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isblocked: {
      type: Boolean,
      default: false
    },
    blockedUsers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'main' 
    }],
    
    // Arrays for tracking requests
    requested: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'main' 
    }], // Users who sent requests
    rejected: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'main' 
    }], // Users whose requests were rejected
    accepted: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'main' 
    }], // Users whose requests were accepted
  
  }, { timestamps: true }); // Automatically adds createdAt and updatedAt fields
  
  

//encryption of password
userSchema.pre('save', async function(next){
    //this will work when password was modified
    if(!this.isModified('password')) return next();
    //hash the password with cost 12
   this.password = await bcrypt.hash(this.password, 12);
   
   this.confirmPassword = undefined;
   next();
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
   
})
userSchema.pre(/^find/, function(next){
    //its query middleware everytime a query starts with find it has to filter all which is active
    this.find({active : {$ne : false}});

    next();
})

//check if the password entered in login is same or not
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
 return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
     const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);

     console.log(changedTimestamp, JWTTimestamp);

     return JWTTimestamp < changedTimestamp;
    }

    return false;
}
userSchema.methods.createResetPasswordToken = function(){
   const resetToken = crypto.randomBytes(32).toString('hex');
   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   this.passwordResetExpires = Date.now() + 10 * 60 *1000; //10 minutes

   return resetToken;
}


const User = mongoose.model('main', userSchema);

module.exports = User;
