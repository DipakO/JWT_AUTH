import jwt from "jsonwebtoken";
import userModel from "../models/users.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  //   console.log(authorization);
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      //   console.log("Token", token);
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Get user from token
      req.user = await userModel.findById(userID).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: "failed", message: "Unotherized User" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unotherized User Token" });
  }
};

export default checkUserAuth;
