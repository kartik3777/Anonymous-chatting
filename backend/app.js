const express = require("express");
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const {app} = require('./socket/index');

const app = express();
app.use(cookieParser());
app.use(cors(
  {
      origin :['https://anonymous-chatting-eight.vercel.app', 'http://localhost:3000'],
      methods:["GET", "POST", "PATCH", "DELETE"],
      credentials: true
  }
))

app.use(helmet()); // for security have to use it
app.use(express.json());
//data sanitization against NoSql query
app.use(mongoSanitize());
app.use(xss());

app.use(morgan('dev')); // it gives info about requests we made

//it sets the limit to request the site and its a middleware so we have to use app.use method
const limiter = rateLimit({
  max: 200,
  windowMs: 60*60*1000,
  message: "Too many requests from this IP, try again after an hour"
});
app.use('/api', limiter);
app.use((req, res, next) => {
  req.requestTime =  new Date().toISOString();
  // console.log(req.headers);

  next();
})


app.use('/api/v1/users', userRouter);
// app.use('/api/v1/singup', userRouter);




module.exports = app;