import mongoose from "mongoose";

const userSChema = new mongoose.Schema({
    username:{type: String, required: true, unique:true},
    email:{type: String, required: true, unique:true},
    password:{type: String, required: true},
    avatar: {type: String,  default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0_XPfyUZJugz5lXkm0DUtAkpjRw367tcFig&s"},
}, {timestamps: true}); // timestamps: true will automatically add createdAt and updatedAt fields to the schema

const User = mongoose.model('User', userSChema); //User is the name of the collection in MongoDB that must be uppercase and singular

export default User;