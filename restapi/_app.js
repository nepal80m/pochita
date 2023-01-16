import express from 'express';
const app = express();
import bodyParser from 'body-parser';
const port = 3000;
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import { credentials as _credentials, Client } from '@grpc/grpc-js';
import { createPrivateKey } from 'crypto';
import { TextDecoder } from 'util';

const channelName = 'mychannel';
const chaincodeName = 'parichaya';
const mspId = 'Org1MSP';
const utf8Decoder = new TextDecoder();




const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.org1.example.com'




app.get("/", async (req, res) => {
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
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

    let result;
    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);

        const resultBytes = await contract.evaluateTransaction('queryAllNationalIdentities');

        const resultJson = utf8Decoder.decode(resultBytes);
        result = JSON.parse(resultJson);
    } finally {
        gateway.close();
        client.close();
    }
    res.send(result);
    // res.send("Hello World!");
});

async function newGrpcConnection() {
    const tlsRootCert = readFileSync('cacert.pem', () => { });
    const tlsCredentials = _credentials.createSsl(tlsRootCert);
    return new Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}



async function newIdentity() {
    const credentials = readFileSync('signcert.pem', () => { });
    return { mspId, credentials };
}

async function newSigner() {
    const keyPath = resolve('privatekey.pem');
    const privateKeyPem = readFileSync(keyPath, () => { });
    const privateKey = createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

