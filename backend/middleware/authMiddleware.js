const jwt = require("jsonwebtoken");

exports.protect = (role) => {
return (req, res, next) => {
  
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }

  if(role[0] == req.user.role || role[1] == req.user.role || role[2] == req.user.role ){
    try{
      next();
    }catch(err){
      return res.status(401).json({ message: err.message });
    }
  }else{
    return res.status(401).json({ message: "Role invalid" });
  }
  
}
};
