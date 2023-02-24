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



class DrivingLicense extends Contract {

    async initLedger(ctx) {
        const drivingLicenses = [

            {
                NIN: "699-526-518-7",
                DVL_DLN: "1234567890",
                DVL_blood_group: "A+",
                DVL_categories: ["A", "B"],
                DVL_date_of_issue: '2020-02-29',
                DVL_date_of_expiry: '2025-02-29',
                DVL_issuer: "Ram Lal",

            },

        ];
        for (const drivingLicense of drivingLicenses) {
            drivingLicense.docType = 'DVL';
            await ctx.stub.putState(
                drivingLicense.NIN,
                Buffer.from(stringify(drivingLicense))
            );
        }
    }

    async queryDrivingLicenseByNIN(ctx, NIN) {
        const drivingLicenseAsBytes = await ctx.stub.getState(NIN); // get the nationalIdentity from chaincode state
        if (!drivingLicenseAsBytes || drivingLicenseAsBytes.length === 0) {
            throw new Error(`Driving License of NIN:${NIN} does not exist`);
        }
        return drivingLicenseAsBytes.toString();
    }

    async createDrivingLicense(ctx, NIN, documentDetails) {

        const exists = await this.checkIfDrivingLicenseExists(ctx, NIN);
        if (exists) {
            throw new Error(`Driving License of NIN:${NIN} already exists`);
        }

        const drivingLicense = JSON.parse(documentDetails);
        drivingLicense.docType = 'DVL';
        await ctx.stub.putState(NIN, Buffer.from(stringify(drivingLicense)));
        return JSON.stringify(drivingLicense)
    }

    async updateDrivingLicense(ctx, NIN, updatedDocumentDetails) {

        const exists = await this.checkIfDrivingLicenseExists(ctx, NIN);
        if (!exists) {
            throw new Error(`Driving License of NIN:${NIN} does not exist`);
        }

        const updatedDrivingLicense = JSON.parse(updatedDocumentDetails)
        await ctx.stub.putState(NIN, Buffer.from(stringify(updatedDrivingLicense)));
        return JSON.stringify(updatedDrivingLicense)
    }

    async deleteDrivingLicense(ctx, NIN) {
        await ctx.stub.deleteState(NIN);
    }


    async queryAllDrivingLicenses(ctx) {
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

    async checkIfDrivingLicenseExists(ctx, NIN) {
        const nationalIdentityAsBytes = await ctx.stub.getState(NIN);
        return nationalIdentityAsBytes && nationalIdentityAsBytes.length > 0;
    }


}

module.exports = DrivingLicense;
