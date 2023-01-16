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
exports.NationalIdentityExists = exports.deleteNationalIdentity = exports.updateNationalIdentity = exports.queryNationalIdentity = exports.createNationalIdentity = exports.queryAllNationalIdentities = void 0;
const connection_1 = require("../connection");
const utf8Decoder = new TextDecoder();
const SECRET_KEY = 'this is a very very secret key!';
const queryAllNationalIdentities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultBytes = yield connection_1.Connection.contract.evaluateTransaction('queryAllNationalIdentities');
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    res.send(result);
});
exports.queryAllNationalIdentities = queryAllNationalIdentities;
const createNationalIdentity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NIN, documentDetails } = req.body;
    if (!NIN || !documentDetails) {
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }
    try {
        const resultBytes = yield connection_1.Connection.contract.submitTransaction('createNationalIdentity', NIN, JSON.stringify(documentDetails));
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});
exports.createNationalIdentity = createNationalIdentity;
const queryNationalIdentity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NIN } = req.params;
    try {
        const resultBytes = yield connection_1.Connection.contract.evaluateTransaction('queryNationalIdentity', NIN);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});
exports.queryNationalIdentity = queryNationalIdentity;
const updateNationalIdentity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NIN, documentDetails } = req.body;
    if (!NIN || !documentDetails) {
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }
    const resultBytes = yield connection_1.Connection.contract.submitTransaction('updateNationalIdentity', NIN, JSON.stringify(documentDetails));
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    res.send(result);
});
exports.updateNationalIdentity = updateNationalIdentity;
const deleteNationalIdentity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NIN } = req.params;
    yield connection_1.Connection.contract.submitTransaction('deleteNationalIdentity', NIN);
    res.status(404).send({ message: "Delete the national identity" });
});
exports.deleteNationalIdentity = deleteNationalIdentity;
const NationalIdentityExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NIN } = req.params;
    try {
        const resultBytes = yield connection_1.Connection.contract.evaluateTransaction('NationalIdentityExists', NIN);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        if (result) {
            res.status(200).send({ NIN, exists: result });
        }
        else {
            res.status(404).send({ NIN, exists: result });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});
exports.NationalIdentityExists = NationalIdentityExists;
