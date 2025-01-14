const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.status(401).send({
        message: "Access Denied",
        success: false,
      });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 123);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authourization Failed",
      success: false,
    });
  }
};
