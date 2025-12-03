const User = require('../Schema/userSchema');
const {generateToken, saveRefreshToken} = require('../token/token');
const jwt = require('jsonwebtoken');

const registerUser = async(req, res) => {
  try{

    const {name, email, password} = req.body;

    //Check if the user exist before
    const user = await User.findOne({$or: [{name}, {email}]});
    if(user) {
      return res.status(400).json({
        message: 'This is a registered user'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    res.status(200).json({
      message: 'User created successfully',
      user: newUser
    });

  } catch(err) {
    res.status(400).json({
      message: err.message
    })
  }
}

const loginUser = async(req, res) => {
  try{

    const {name, password} = req.body
    //Check if user exist
    const user = await User.findOne({name}).select('+password');

    if(!user) {
      return res.status(404).json({
        message: 'Invalid username'
      });
    }

    //Check if password is correct
    const checkPass = await user.isCorrectPassword(password, user.password);

    if(!checkPass) {
      return res.status(404).json({
        message: 'Invalid password'
      });
    }

    //Generate token after login
    const {accessToken, refreshToken} = generateToken(user);
    saveRefreshToken(res, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      token: accessToken
    })
  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
}

const refreshAccessToken = async(req, res) => {
  try{

    const token = req.cookies.refreshToken;
    
    if(!token) {
      return res.status(401).json({
        message: 'No refresh token'
      });
    }

    
   const check = jwt.verify(token, process.env.refreshToken);

   if(!check) {
    return res.status(403).json({
      message: 'Invalid refresh token'
    });
   }
  
   //Generate new access token
   const {accessToken, refreshToken} = generateToken(check);

   saveRefreshToken(res, refreshToken);

   res.status(200).json({
    token: accessToken
   });

  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
}

const decodeToken = async(req, res) => {
  try{

    const data = req.userInfo;

    res.status(200).json({
      data
    });

  } catch(err) {
    res.status(404).json({
      message: err.message
    })
  }
}

const logOut = async(req, res) => {
  try{

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/api/blog/refresh",
  });

  res.json("Logged out successfully");

  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
}

module.exports = {registerUser, loginUser, refreshAccessToken, logOut, decodeToken}