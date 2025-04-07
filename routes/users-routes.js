import express from "express";
import UserModel from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticationMiddleware } from "../middleware/index.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        // Check if user exists
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hashing pass
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        // Create user
        await UserModel.create(req.body);
        return res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        // Check is user exists
       
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "User does not exists" });
        }

        // compare pass
        const passwordMatched = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordMatched) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Create a JWT token and return it
        const token = jwt.sign({
            userID: user._id,
            email: user.email,
        }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        return res.status(200).json({ user,token, message: "User logged in successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/current-user", authenticationMiddleware, async(req, res)=> {
    try {
        const userId = req.user.userID;
        const user = await UserModel.findById(userId).select("-password");
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;