const express = require('express');
const router = express.Router();
const User = require('../models/user');
const brycpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill the required fields" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const user = new User({ name, email, password });
        await user.save();
        return res.status(200).json({ msg: "Registration successful" });
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
}

const signin = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the required fields" });
        }
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await brycpt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid credentials" });
            }
            else{
                const token = await user.generateAuthToken();
                let role = user.role;
                if(role === null){
                    role = "user"
                }
                return res.status(200).json({ msg: "Login successful",token: token , role: role, email: email, name: user.name});
            }
        }
        else{
            return res.status(400).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Some error occured" });
    }
}

const verifyToken = async(req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: "Token not found" });
        }
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        if (verify) {
            return res.status(200).json({ msg: "verified" });
        }
        else{
            return res.status(200).json({ msg: "notverified" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
}

const setMyRole = async(req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findOne({ email : req.email });
        user.role = role;
        await user.save();
        return res.status(200).json({ msg: "Role set successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Some error occured" });
    }
}

module.exports = { signup, signin, verifyToken, setMyRole };