const jwt = require("jsonwebtoken");

exports.protect = (role) => {
return (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Role invalid" });
  }

  return next();
}
};
