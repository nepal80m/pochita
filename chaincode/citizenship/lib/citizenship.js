/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');
const { stopCoverage } = require('v8');



class Citizenship extends Contract {

    async initLedger(ctx) {
        const citizenships = [

            {
                NIN: "699-526-518-7",
                CTZ_CCN: "123456789",
                CTZ_issued_district: "Kathmandu",
                CTZ_issued_date: new Date('2020-02-29').toISOString(),
                CTZ_issuer_name: "Ram Lal",

            },

        ];
        for (const citizenship of citizenships) {
            citizenship.docType = 'CTZ';
            await ctx.stub.putState(
                citizenship.NIN,
                Buffer.from(stringify(citizenship))
            );
        }
    }

    async queryCitizenshipByNIN(ctx, NIN) {
        const citizenshipAsBytes = await ctx.stub.getState(NIN); // get the nationalIdentity from chaincode state
        if (!citizenshipAsBytes || citizenshipAsBytes.length === 0) {
            throw new Error(`Citizenship of NIN:${NIN} does not exist`);
        }
        return citizenshipAsBytes.toString();
    }

    async createCitizenship(ctx, NIN, documentDetails) {

        const exists = await this.checkIfCitizenshipExists(ctx, NIN);
        if (exists) {
            throw new Error(`Citizenship of NIN:${NIN} already exists`);
        }

        const citizenship = JSON.parse(documentDetails);
        citizenship.docType = 'CTZ';
        await ctx.stub.putState(NIN, Buffer.from(stringify(citizenship)));
        return JSON.stringify(citizenship)
    }

    async updateCitizenship(ctx, NIN, updatedDocumentDetails) {

        const exists = await this.checkIfCitizenshipExists(ctx, NIN);
        if (!exists) {
            throw new Error(`Citizenship of NIN:${NIN} does not exist`);
        }

        const updatedCitizenship = JSON.parse(updatedDocumentDetails)
        await ctx.stub.putState(NIN, Buffer.from(stringify(updatedCitizenship)));
        return JSON.stringify(updatedCitizenship)
    }

    async deleteCitizenship(ctx, NIN) {
        await ctx.stub.deleteState(NIN);
    }


    async queryAllCitizenships(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];

        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            allResults.push(record);
        }
        return JSON.stringify(allResults);
    }

    async checkIfCitizenshipExists(ctx, key) {
        const citizenshipAsBytes = await ctx.stub.getState(key);
        return citizenshipAsBytes && citizenshipAsBytes.length > 0;
    }


}

module.exports = Citizenship;
