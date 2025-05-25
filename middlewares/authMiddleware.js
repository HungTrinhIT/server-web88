import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
  try {
    // Exist accessToken
    if (
      req.headers['x-access-token'] &&
      req.headers['x-access-token'].startsWith('Bearer')
    ) {
      // Step 1: Get access token from headers
      const accessToken = req.headers['x-access-token'].split(' ')[1];

      // Step 2: verify token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

      // Step 3: ger user from the token (excluding the password)
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return res.status(401).json({
          message: 'Not authorized, user not found',
        });
      }

      req.user = currentUser;
      next();
    } else {
      res.status(400).json({
        message: 'Not authorized, token failed',
      });
    }
  } catch (error) {
    console.log('[ERROR]:', error);

    // Wrong secret key
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Not authorized, token failed (invalid signature)',
      });
    }

    // token is expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Not authorized, token expired',
      });
    }
  }
};
