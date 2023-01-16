import userModel from '../models/user';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';


const SECRET_KEY = 'this is a very very secret key!';
export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            username,
            password: hashedPassword
        })

        const token = sign({ username: result.username, id: result._id }, SECRET_KEY,
            // { expiresIn: "1h" }
        );
        res.status(201).json({ user: result, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });
    }
};


export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ username })
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password)

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const token = sign({ username: existingUser.username, id: existingUser._id }, SECRET_KEY,
            //  { expiresIn: "1h" }
        );
        res.status(201).json({ user: existingUser, token });



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });
    }

};

