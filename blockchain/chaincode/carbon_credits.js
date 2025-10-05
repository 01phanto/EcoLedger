/*
Hyperledger Fabric chaincode for Carbon Credits
Save as: blockchain/chaincode/carbon_credits.js

Implements AddCarbonCredit and QueryAllCredits function
*/

'use strict';

const { Contract } = require('fabric-contract-api');

class CarbonCreditContract extends Contract {

    constructor() {
        super('CarbonCreditContract');
    }

    // Utility to create composite key
    _creditKey(ctx, creditId) {
        return ctx.stub.createCompositeKey('CarbonCredit', [creditId]);
    }

    async InitLedger(ctx) {
        console.info('Initializing Ledger with sample credits');
        const sample = [];
        for (const c of sample) {
            const key = this._creditKey(ctx, c.id);
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(c)));
        }
    }

    /**
     * AddCarbonCredit - store a verified carbon credit on the ledger
     * creditData is a JSON string or object with: {creditId, projectId, ngoName, credits, verificationScore, timestamp, metadata}
     */
    async AddCarbonCredit(ctx, creditData) {
        if (!creditData) {
            throw new Error('creditData is required');
        }

        let creditObj = typeof creditData === 'string' ? JSON.parse(creditData) : creditData;

        if (!creditObj.creditId) {
            // generate a simple id if not provided
            creditObj.creditId = ctx.stub.getTxID();
        }

        const key = this._creditKey(ctx, creditObj.creditId);

        // Add createdBy and tx metadata
        const txId = ctx.stub.getTxID();
        creditObj.txId = txId;
        creditObj.createdAt = creditObj.timestamp || new Date().toISOString();
        creditObj.type = 'CarbonCredit';

        const exists = await ctx.stub.getState(key);
        if (exists && exists.length > 0) {
            throw new Error(`CarbonCredit with id ${creditObj.creditId} already exists`);
        }

        const serialized = Buffer.from(JSON.stringify(creditObj));
        await ctx.stub.putState(key, serialized);

        // Emit an event for real-time UI updates
        ctx.stub.setEvent('CarbonCreditAdded', serialized);

        return JSON.stringify({ success: true, creditId: creditObj.creditId, txId });
    }

    /**
     * QueryAllCredits - returns all carbon credits in the ledger
     */
    async QueryAllCredits(ctx) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('CarbonCredit', []);

        const results = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const record = JSON.parse(res.value.value.toString('utf8'));
                results.push(record);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(results);
    }

    /**
     * GetCreditById - returns a single credit by creditId
     */
    async GetCreditById(ctx, creditId) {
        const key = this._creditKey(ctx, creditId);
        const data = await ctx.stub.getState(key);
        if (!data || data.length === 0) {
            throw new Error(`Credit ${creditId} not found`);
        }
        return data.toString();
    }
}

module.exports = CarbonCreditContract;
