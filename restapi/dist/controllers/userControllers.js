"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const user_1 = require("../models/user");
const bcrypt = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const SECRET_KEY = 'this is a very very secret key!';
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const result = yield user_1.default.create({
            username,
            password: hashedPassword
        });
        const token = (0, jsonwebtoken_1.sign)({ username: result.username, id: result._id }, SECRET_KEY);
        res.status(201).json({ user: result, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const matchPassword = yield bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = (0, jsonwebtoken_1.sign)({ username: existingUser.username, id: existingUser._id }, SECRET_KEY);
        res.status(201).json({ user: existingUser, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});
exports.signin = signin;
