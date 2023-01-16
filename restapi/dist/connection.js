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
exports.Connection = void 0;
const fabric_gateway_1 = require("@hyperledger/fabric-gateway");
const grpc_js_1 = require("@grpc/grpc-js");
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const channelName = 'mychannel';
const chaincodeName = 'parichaya';
const mspId = 'Org1MSP';
const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.org1.example.com';
class Connection {
    init() {
        initFabric();
    }
}
exports.Connection = Connection;
function initFabric() {
    return __awaiter(this, void 0, void 0, function* () {
        // The gRPC client connection should be shared by all Gateway connections to this endpoint.
        const client = yield newGrpcConnection();
        const gateway = (0, fabric_gateway_1.connect)({
            client,
            identity: yield newIdentity(),
            signer: yield newSigner(),
            // Default timeouts for different gRPC calls
            evaluateOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 15000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        try {
            // Get a network instance representing the channel where the smart contract is deployed.
            const network = gateway.getNetwork(channelName);
            // Get the smart contract from the network.
            const contract = network.getContract(chaincodeName);
            Connection.contract = contract;
            // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
            //        await initLedger(contract);
        }
        catch (e) {
            console.log("Couldn't get the network or the contract..");
            console.log(e.message);
        }
        finally {
            console.log('Connected to the blockchain..');
            // gateway.close();
            // client.close();
        }
    });
}
function newGrpcConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const tlsRootCert = (0, fs_1.readFileSync)('cacert.pem');
        const tlsCredentials = grpc_js_1.credentials.createSsl(tlsRootCert);
        return new grpc_js_1.Client(peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': peerHostAlias,
        });
    });
}
function newIdentity() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = (0, fs_1.readFileSync)('signcert.pem');
        return { mspId, credentials };
    });
}
function newSigner() {
    return __awaiter(this, void 0, void 0, function* () {
        const keyPath = (0, path_1.resolve)('privatekey.pem');
        const privateKeyPem = (0, fs_1.readFileSync)(keyPath);
        const privateKey = (0, crypto_1.createPrivateKey)(privateKeyPem);
        return fabric_gateway_1.signers.newPrivateKeySigner(privateKey);
    });
}
