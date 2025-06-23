const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }
  try{
  console.log("Token received for authentication:", jwt.verify(token, process.env.JWT_SECRET));
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    console.log("Decoded JWT:", req.user);
    next();
  });
}
  catch (error) {
    console.error("Error during JWT verification:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const authenticateRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticateJWT, authenticateRole };
