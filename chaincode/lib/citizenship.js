/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');



class NationalIdentity extends Contract {

    async initLedger(ctx) {
        const nationalIdentities = [

            {
                nationalIdentityNumber: "ced71693-23a1-42dc-84c7-117722e8ae12",
                firstName: 'Asim',
                lastName: 'Nepal',
                dob: new Date('2000-02-29').toISOString(),
                gender: 'Male',
                mobileNumber: '9851234567',
            },

            {
                nationalIdentityNumber: "ddd4a7bd-0e5e-40d0-93c7-9a7552d22cfe",
                firstName: 'Wednesday',
                lastName: 'Addams',
                dob: new Date('2000-01-01').toISOString(),
                gender: 'Female',
                mobileNumber: '9841234567',
            },

        ];
        for (const nationalIdentity of nationalIdentities) {
            nationalIdentity.docType = 'nationalIdentity';
            await ctx.stub.putState(nationalIdentity.nationalIdentityNumber, Buffer.from(stringify(sortKeysRecursive(nationalIdentity))));
        }
    }

    async queryNationalIdentity(ctx, nationalIdentityNumber) {
        const nationalIdentityAsBytes = await ctx.stub.getState(nationalIdentityNumber); // get the nationalIdentity from chaincode state
        if (!nationalIdentityAsBytes || nationalIdentityAsBytes.length === 0) {
            throw new Error(`National Identity ${nationalIdentityNumber} does not exist`);
        }
        return nationalIdentityAsBytes.toString();
    }

    async createNationalIdentity(ctx, nationalIdentityNumber, firstName, lastName, gender, dob, mobileNumber) {

        const exists = await this.NationalIdentityExists(ctx, nationalIdentityNumber);
        if (exists) {
            throw new Error(`National identity ${id} already exists`);
        }

        const nationalIdentity = {
            nationalIdentityNumber,
            firstName,
            lastName,
            dob,
            gender,
            mobileNumber,
        }
        await ctx.stub.putState(nationalIdentityNumber, Buffer.from(stringify(sortKeysRecursive(nationalIdentity))));
        return JSON.stringify(nationalIdentity)
    }

    async updateNationalIdentity(ctx, nationalIdentityNumber, firstName, lastName, gender, dob, mobileNumber) {

        const exists = await this.NationalIdentityExists(ctx, nationalIdentityNumber);
        if (!exists) {
            throw new Error(`National identity ${id} does not exist`);
        }

        const updatedNationalIdentity = {
            nationalIdentityNumber,
            firstName,
            lastName,
            dob,
            gender,
            mobileNumber,
        }
        return ctx.stub.putState(nationalIdentityNumber, Buffer.from(stringify(sortKeysRecursive(updatedNationalIdentity))));
    }

    async queryAllNationalIdentities(ctx) {
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

    // AssetExists returns true when asset with given ID exists in world state.
    async NationalIdentityExists(ctx, key) {
        const nationalIdentityAsBytes = await ctx.stub.getState(key);
        return nationalIdentityAsBytes && nationalIdentityAsBytes.length > 0;
    }


}

module.exports = NationalIdentity;
