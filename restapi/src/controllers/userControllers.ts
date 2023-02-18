import userModel from '../models/user';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';


const SECRET_KEY = 'this is a very very secret key!';
export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(`Register requested with username=${username} and password=${password}`)

    try {
        const existingUser = await userModel.findOne({ username })
        if (existingUser) {
            console.log("User already exists")
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            username,
            password: hashedPassword
        })
        console.log(`Registered user: ${result}`)

        const token = sign({ username: result.username, id: result._id }, SECRET_KEY,
            // { expiresIn: "1h" }
        );
        console.log(`Created token: ${token}`)
        res.status(201).json({ user: username, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });
    }
};


export const login = async (req: Request, res: Response) => {
    console.log(req.body)
    console.log(req.params)

    const { username, password } = req.body;
    console.log(`Login requested with username=${username} and password=${password}`)

    try {
        const existingUser = await userModel.findOne({ username })
        if (!existingUser) {
            console.log("User not found.")
            return res.status(404).json({ message: "User not found" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password)
        if (!matchPassword) {

            console.log("Password does not match.")
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        const token = sign({ username: existingUser.username, id: existingUser._id }, SECRET_KEY,
            //  { expiresIn: "1h" }
        );
        console.log(`Logged in. Returning token: ${token}`)
        res.status(201).json({ user: existingUser.username, token });



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });
    }

};

