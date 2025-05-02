import { UsersModel } from "../Models/UsersModel.js";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { emailRegex, SALT } from "../config.js";
dotenv.config();

const RegisterNormalUser = async (req, res) => {
  try {
    const { email, password, firstName, lastNamem, role} = req.body;
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        message: "bad request check data again",
        data: req.body,
      });
    }
    const isEmailValidationTrue = emailRegex.test(email);
    if (!isEmailValidationTrue) {
      return res.status(401).json({
        message: "email is not valid",
        data: req.body,
      });
    }

    const roleData = await RolesModel.findById(roleId)

    const hashedPassword = await bcrypt.hash(password, SALT);
    const newUser = {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      role: roleData._id,
      createdByUserId: "guest",
      updatedByUserId: "guest",
      published: true,
    };
    const user = await UsersModel.create(newUser);
    user.password = "";
    return res.status(200).json({
      message: "user added successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
export {
    RegisterNormalUser
}