const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const headers = req.headers.authorization;
  const token = headers.split(' ')[1];
  
  try{

    const decoded = jwt.verify(token, process.env.accessToken);
    req.userInfo = decoded;

    next();
  } catch(err) {
    res.status(404).json({
      message: err.message
    });
  }
    
}

module.exports = { protect };