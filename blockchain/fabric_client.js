/*
Fabric Gateway client for submitting transactions and querying the ledger.
Requires fabric-network and gateway connection profile.
Save as: blockchain/fabric_client.js

Usage:
  node fabric_client.js addCredit '{...json...}'
  node fabric_client.js queryAll
*/

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const CONNECTION_PROFILE = process.env.FABRIC_CONNECTION_PROFILE || path.resolve(__dirname, 'connection.json');
const WALLET_PATH = process.env.FABRIC_WALLET || path.resolve(__dirname, 'wallet');
const MSP_ID = process.env.FABRIC_MSP_ID || 'Org1MSP';
const IDENTITY_LABEL = process.env.FABRIC_IDENTITY || 'appUser';
const CHANNEL_NAME = process.env.FABRIC_CHANNEL || 'mychannel';
const CHAINCODE_NAME = process.env.FABRIC_CHAINCODE || 'carbon_credits';

async function initGateway() {
    const ccpPath = CONNECTION_PROFILE;
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

    const identity = await wallet.get(IDENTITY_LABEL);
    if (!identity) {
        throw new Error(`Identity ${IDENTITY_LABEL} not found in wallet ${WALLET_PATH}`);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: IDENTITY_LABEL, discovery: { enabled: true, asLocalhost: true } });
    return gateway;
}

async function addCredit(creditJson) {
    const gateway = await initGateway();
    try {
        const network = await gateway.getNetwork(CHANNEL_NAME);
        const contract = network.getContract(CHAINCODE_NAME);
        const input = typeof creditJson === 'string' ? creditJson : JSON.stringify(creditJson);
        const result = await contract.submitTransaction('AddCarbonCredit', input);
        await gateway.disconnect();
        return result.toString();
    } catch (err) {
        await gateway.disconnect();
        throw err;
    }
}

async function queryAll() {
    const gateway = await initGateway();
    try {
        const network = await gateway.getNetwork(CHANNEL_NAME);
        const contract = network.getContract(CHAINCODE_NAME);
        const result = await contract.evaluateTransaction('QueryAllCredits');
        await gateway.disconnect();
        return result.toString();
    } catch (err) {
        await gateway.disconnect();
        throw err;
    }
}

// CLI helper
if (require.main === module) {
    const action = process.argv[2];
    const payload = process.argv[3];

    (async () => {
        try {
            if (action === 'addCredit') {
                if (!payload) {
                    console.error('Usage: node fabric_client.js addCredit "{...json...}"');
                    process.exit(1);
                }
                const res = await addCredit(payload);
                console.log('AddCredit result:', res);
            } else if (action === 'queryAll') {
                const res = await queryAll();
                console.log('QueryAll result:', res);
            } else {
                console.error('Unknown action. Use addCredit or queryAll');
                process.exit(1);
            }
        } catch (err) {
            console.error('Error:', err);
            process.exit(1);
        }
    })();
}

module.exports = { addCredit, queryAll };
