const User = require("../models/User");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.signup = async (req, res) => {
  try {
    const { username, password, createdAt } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
  
    // Let Mongoose pre-save hook handle password hashing
    const user = await User.create({ username, password, createdAt });
    const token = createSecretToken(user._id);
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
    });
      res.status(201).json({ message: "User signed up successfully", success: true, user });
    } catch (error) {
      console.error(error);
    }
  };
  

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ $or: [{ email: username }, { username: username }] });
    if(!user){
      console.log(`User with username ${username} not found`);
      return res.json({message:'Incorrect password or username' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      console.log(`Passwords do not match for user ${username}`);
      return res.json({message:'Incorrect password or username' }) 
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(200).json({ message: "User logged in successfully", success: true, user });
  } catch (error) {
    console.error(error);
  }
};

