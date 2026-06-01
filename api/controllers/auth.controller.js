import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";

//Sign Up
export const signup =async (req, res, next) => {
    const {username , email, password} = req.body; //we get the data from the request body
    const hashedPAssword = bcryptjs.hashSync(password, 10); //hashSync means hashSync waits for the hashing , so we dont need to use await here, 10 is the number of rounds for hashing
    const newUser = new User({username, email, password: hashedPAssword}); //we create a new user using the User model
    try {
        await newUser.save(); //we save the user to the database 
        res.status(201).json({"message": "User created successfully",})
    } catch (error) {
        next(error);
    }   
};

//Sign In
export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, "User not found!)"));
        const validPassword =  bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc; //we use destructuring to exclude the password from the user object that we send back to the client. _doc is a property of the Mongoose document that contains the actual data of the document.
        res.cookie("access_token", token, {httpOnly: true}).status(200).json({
            success: true,
            message: "User signed in successfully",
            rest
        });
        
    } catch (error) {
        next(error); //we pass the error to the next middleware (error handling middleware) to handle it
    }
}

//Google Sign In
export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res.cookie("access_token", token, 
                {httpOnly: true})
                .status(200)
                .json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPAssword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split("").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPAssword,
                avatar: req.body.photo,
            })
            await newUser.save();
            const token = jet.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.cookie("access_token", token, {httpOnly: true}), status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}

//Sign Out
export const signOut = (req, res) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json("User signed out successfully");
    } catch (error) {
        next(error);
    }
}