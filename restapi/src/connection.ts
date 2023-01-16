import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import { credentials as _credentials, Client } from '@grpc/grpc-js';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { createPrivateKey } from 'crypto';

const channelName = 'mychannel';
const chaincodeName = 'parichaya';
const mspId = 'Org1MSP';
const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.org1.example.com'



export class Connection {
    public static contract: Contract;
    public init() {
        initFabric()
    }
}

async function initFabric() {
    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
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

    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);
        Connection.contract = contract;

        // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
        //        await initLedger(contract);


    } catch (e) {
        console.log("Couldn't get the network or the contract..");
        console.log(e.message);
    } finally {
        console.log('Connected to the blockchain..');
        // gateway.close();
        // client.close();
    }
}



async function newGrpcConnection() {
    const tlsRootCert = readFileSync('cacert.pem');
    const tlsCredentials = _credentials.createSsl(tlsRootCert);
    return new Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}



async function newIdentity() {
    const credentials = readFileSync('signcert.pem');
    return { mspId, credentials };
}

async function newSigner() {
    const keyPath = resolve('privatekey.pem');
    const privateKeyPem = readFileSync(keyPath);
    const privateKey = createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}
