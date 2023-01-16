"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = require("../controllers/userControllers");
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", userControllers_1.signup);
userRouter.post("/signin", userControllers_1.signin);
exports.default = userRouter;
