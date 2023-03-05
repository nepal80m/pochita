import { Request, Response } from 'express';
import { Connection } from '../connection';
const utf8Decoder = new TextDecoder();


export const queryAllNationalIdentities = async (req: Request, res: Response) => {

    console.log("Requested to query all national identities")


    const resultBytes = await Connection.nationalIdentityContract.evaluateTransaction('queryAllNationalIdentities');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log(`Returning data: ${result}`)
    res.json(result)
};



export const createNationalIdentity = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    console.log(`Requested to create NID with NIN: {NIN}`)
    console.log(documentDetails)
    if (!NIN || !documentDetails) {
        console.log("NIN or documentDetails missing")
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }
    try {

        const resultBytes = await Connection.nationalIdentityContract.submitTransaction('createNationalIdentity',
            NIN,
            JSON.stringify({
                ...documentDetails,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(`Created national identity with NIN: ${NIN}`)
        console.log(`Returning data: ${result}`)
        res.json(result)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }





};

export const queryNationalIdentity = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Requested to query NID with NIN: ${NIN}`)
    try {



        const checkResultBytes = await Connection.nationalIdentityContract.evaluateTransaction('checkIfNationalIdentityExists', NIN);
        const checkResultJson = utf8Decoder.decode(checkResultBytes);
        const exists = JSON.parse(checkResultJson);
        if (exists) {
            console.log("NID exists")

            const resultBytes = await Connection.nationalIdentityContract.evaluateTransaction('queryNationalIdentity', NIN);
            const resultJson = utf8Decoder.decode(resultBytes);
            const result = JSON.parse(resultJson);
            console.log(`Returning data: ${JSON.stringify(result)}`)
            res.status(200).json(result)


        }
        else {
            console.log("NID does not exist")
            res.status(404).json({ message: "NID does not exist" })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};





export const updateNationalIdentity = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    console.log(`Requested to update NID with NIN: ${NIN}`)
    if (!NIN || !documentDetails) {
        console.log("NIN or documentDetails missing")
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }

    const resultBytes = await Connection.nationalIdentityContract.submitTransaction('updateNationalIdentity',
        NIN,
        JSON.stringify({
            ...documentDetails,
            updatedAt: new Date().toISOString()
        }));

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log(`Updated national identity with NIN: ${NIN}`)
    console.log(`Returning data: ${result}`)
    res.json(result)
};


export const deleteNationalIdentity = async (req: Request, res: Response) => {

    const { NIN } = req.params
    console.log(`Requested to delete NID with NIN: ${NIN}`)

    await Connection.nationalIdentityContract.submitTransaction('deleteNationalIdentity', NIN);
    console.log(`Deleted national identity with NIN: ${NIN}`);


    res.status(404).json({ message: "Deleted the national identity" });
};



export const checkIfNationalIdentityExists = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Requested to check if NID with NIN: ${NIN} exists`)

    try {

        const resultBytes = await Connection.nationalIdentityContract.evaluateTransaction('checkIfNationalIdentityExists', NIN);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        if (result) {
            console.log("NID exists")
            res.status(200).json({ NIN, exists: result })
        }
        else {
            console.log("NID does not exist")
            res.status(404).json({ NIN, exists: result })

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};



export const getLastUpdatedDate = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Requested to get last updated date of NID with NIN: ${NIN}`)

    try {
        let resultBytes = await Connection.nationalIdentityContract.evaluateTransaction('checkIfNationalIdentityExists', NIN);
        let resultJson = utf8Decoder.decode(resultBytes);
        let result = JSON.parse(resultJson);
        if (!result) {
            console.log("NID does not exist")
            res.status(404).json({ message: "NID doesnot exist." })
        }


        resultBytes = await Connection.nationalIdentityContract.evaluateTransaction('getLastUpdatedDate', NIN);
        resultJson = utf8Decoder.decode(resultBytes);
        // result = JSON.parse(resultJson);
        console.log(`Document last updated at ${resultJson}`)
        res.status(200).json({ NIN, updatedAt: resultJson })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};