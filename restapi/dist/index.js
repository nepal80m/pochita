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
// import express, { json } from 'express';
const express = require("express");
const mongoose_1 = require("mongoose");
const userRoutes_1 = require("./routes/userRoutes");
const NIDRoutes_1 = require("./routes/NIDRoutes");
const connection_1 = require("./connection");
const auth_1 = require("./middlewares/auth");
const utf8Decoder = new TextDecoder();
new connection_1.Connection().init();
const app = express();
app.use(express.json());
app.use('/users', userRoutes_1.default);
app.use('/nid', auth_1.default, NIDRoutes_1.default);
app.get('/', (req, res) => {
    res.send('chalyo');
});
app.get('/all', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultBytes = yield connection_1.Connection.contract.evaluateTransaction('queryAllNationalIdentities');
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    res.send(result);
}));
(0, mongoose_1.set)("strictQuery", false);
(0, mongoose_1.connect)("mongodb+srv://testuser:testuser@cluster0.teegdcn.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
    app.listen(3000, () => {
        console.log('listening on port 3000');
    });
})
    .catch((error) => {
    console.log(error);
});
