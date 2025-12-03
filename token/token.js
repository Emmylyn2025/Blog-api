const jwt = require('jsonwebtoken');

function generateToken (user) {

  const accessToken = jwt.sign({
    id: user._id,
    name: user.name
  }, process.env.accessToken, {expiresIn: '15m'});

  const refreshToken = jwt.sign({
    id: user._id,
    name: user.name
  }, process.env.refreshToken, {expiresIn: '30d'});

  return {accessToken, refreshToken};
}

//Save refresh tokenin cookie
const saveRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/api/blog/refresh",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

module.exports = {generateToken, saveRefreshToken};