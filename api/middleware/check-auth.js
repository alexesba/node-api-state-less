const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY, null);
    req.userData = decoded;
    next();
  } catch(error) {
    console.log(error);
    return res.status(401).json({
      message: 'Auth failed',
      error
    });
  }
};
