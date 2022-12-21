import userModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_Confirm, tc } = req.body;
    const user = await userModel.findOne({ email: email });
    console.log(user);
    if (user) {
      res.send({ status: "failed", massege: "Email is Alreday exits" });
    } else {
      if (name && email && password && password_Confirm && tc) {
        if (password === password_Confirm) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new userModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await doc.save();
            const saved_user = await userModel.findOne({ email: email });
            // Generate Jwt token
            const token = jwt.sign(
              {
                userID: saved_user._id,
              },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              massege: "Registration Succesfull",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "failed", massege: "Unable to register" });
          }
        } else {
          res.send({
            status: "failed",
            massege: "Password and confirm password does not match",
          });
        }
      } else {
        res.send({ status: "failed", massege: "All feild are required" });
      }
    }
  };

  // Login
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await userModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate JWT token
            const token = jwt.sign(
              {
                userID: user._id,
              },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "5d",
              }
            );
            res.send({
              status: "success",
              massege: "Login Succesfully",
              token: token,
            });
          } else {
            res.send({
              status: "failed",
              massege: "Password or Email not match",
            });
          }
        } else {
          res.send({
            status: "failed",
            massege: "User Not Register plz register before login",
          });
        }
      } else {
        res.send({ status: "failed", massege: "All feild are required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", massege: "Unable to Login" });
    }
  };

  // Logged user
  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  // Change User Password
  static changeUserPassword = async (req, res) => {
    const { password, password_Confirm } = req.body;
    if (password && password_Confirm) {
      if (password != password_Confirm) {
        res.send({
          status: "failed",
          massege: "Password and Confirm Password Does not match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);

        await userModel.findByIdAndUpdate(req.user._id, {
          $set: {
            password: newHashPassword,
          },
        });
        res.send({
          "status ": "success",
          message: "Password change succsfully",
        });
      }
    } else {
      res.send({ status: "failed", massege: "All feilds are required" });
    }
  };

  static sendPasswordChangeMail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await userModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;

        const token = jwt.sign(
          {
            userID: user._id,
          },
          secret,
          {
            expiresIn: "15m",
          }
        );
        // const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
        const link = `http://127.0.0.1:3000/users/reset/${user._id}/${token}`;

        // Send Email Code
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Login Password Reset Link",
          html: `<a href=${link}> Click here</a> To reset password`,
        });
        res.send({
          "status ": "success",
          message: "Password Reset Email Send.... Please Check Your Email",
          info: info,
        });
      } else {
        res.send({ status: "failed", massege: "Email doesnot exits" });
      }
    } else {
      res.send({ status: "failed", massege: "Email feilds are required" });
    }
  };

  // USer password reset // forget password
  static passwordReset = async (req, res) => {
    const { password, password_Confirm } = req.body;
    const { id, token } = req.params;
    const user = await userModel.findById(id);
    const new_Secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, new_Secret);
      if (password && password_Confirm) {
        if (password !== password_Confirm) {
          res.send({
            status: "failed",
            massege: "Password and confirm password does not equal",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await userModel.findByIdAndUpdate(user._id, {
            $set: {
              password: newHashPassword,
            },
          });
          res.send({
            "status ": "success",
            message: "Password Reset succsfully",
          });
        }
      } else {
        res.send({ status: "failed", massege: "All feilds are required" });
      }
    } catch (error) {}
  };
}

export default UserController;
