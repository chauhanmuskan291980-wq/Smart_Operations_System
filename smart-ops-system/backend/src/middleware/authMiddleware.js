import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adds { userId, role } to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Check for specific roles (Admin, Manager, User)
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: Insufficient permissions" });
    }
    next();
  };
};