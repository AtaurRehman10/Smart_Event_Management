export const errorHandler = (err, req, res, next) => {
     console.error('❌ Error:', err.message);

     if (err.name === 'ValidationError') {
          const messages = Object.values(err.errors).map(e => e.message);
          return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
     }

     if (err.name === 'CastError') {
          return res.status(400).json({ success: false, message: 'Invalid ID format' });
     }

     if (err.code === 11000) {
          const field = Object.keys(err.keyValue)[0];
          return res.status(400).json({ success: false, message: `Duplicate value for ${field}` });
     }

     if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ success: false, message: 'Invalid token' });
     }

     if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ success: false, message: 'Token expired' });
     }

     res.status(err.statusCode || 500).json({
          success: false,
          message: err.message || 'Internal Server Error',
     });
};
