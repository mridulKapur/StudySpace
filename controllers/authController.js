const User = require("../models/userModel.js")
const jwt = require("jsonwebtoken")

const signToken = id => {
  // console.log(id)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn:process.env.JWT_EXPIRY
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  // console.log(token);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRY*1000
    ),
    HttpOnly:true,
  };
  res.cookie('jwt', token, cookieOptions)
  user.password = undefined;
  user.passCreatedAt = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    }
  })
}

exports.signup = async (req, res, next) => {
  try 
  {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passCreatedAt: new Date(Date.now())
    })
    createSendToken(newUser, 201, res)
  }
  catch (err) {
    res.status(400).json({
      status: "fail",
      errmessage:err,
    })
  }
  next();
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({status:"fail",messgae:"provide email or password!"})
  }

  const user = await User.findOne({ email }).select("+password")
  
  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({ status: "fail", message: "incorrect credentials!" })
  }
  createSendToken(user, 200, res)
  next();
}

exports.protect = async (req, res, next) => {
  //check token
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      status: "anauthorized",
      message:"Login to get access",
    })
  }

  // verify token
  var decoded;
  jwt.verify(token, process.env.JWT_SECRET, (err, dec) => { decoded = dec; });

  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      status: "fail",
      message:"user doesnt exist",
    })
  }

  //user changed password
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return res.status(401).json({
  //     status: "fail",
  //     message:"token expired: changed password recently",
  //   })
  // }

  req.user = currentUser;
  next();
};