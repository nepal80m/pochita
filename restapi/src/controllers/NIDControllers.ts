import { Request, Response } from 'express';
import { Connection } from '../connection';
const utf8Decoder = new TextDecoder();

const SECRET_KEY = 'this is a very very secret key!';

export const queryAllNationalIdentities = async (req: Request, res: Response) => {


    const resultBytes = await Connection.contract.evaluateTransaction('queryAllNationalIdentities');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    res.send(result)
};



export const createNationalIdentity = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    if (!NIN || !documentDetails) {
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }
    try {

        const resultBytes = await Connection.contract.submitTransaction('createNationalIdentity', NIN, JSON.stringify(documentDetails));

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        res.send(result)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }





};

export const queryNationalIdentity = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Getting data for NIN: ${NIN}`)
    try {

        const resultBytes = await Connection.contract.evaluateTransaction('queryNationalIdentity', NIN);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(`Sending data: ${result}`)
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};





export const updateNationalIdentity = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    if (!NIN || !documentDetails) {
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }

    const resultBytes = await Connection.contract.submitTransaction('updateNationalIdentity', NIN, JSON.stringify(documentDetails));

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    res.send(result)
};


export const deleteNationalIdentity = async (req: Request, res: Response) => {

    const { NIN } = req.params


    await Connection.contract.submitTransaction('deleteNationalIdentity', NIN);

    res.status(404).send({ message: "Delete the national identity" })
};



export const NationalIdentityExists = async (req: Request, res: Response) => {
    const { NIN } = req.params

    try {

        const resultBytes = await Connection.contract.evaluateTransaction('NationalIdentityExists', NIN);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        if (result) {

            res.status(200).send({ NIN, exists: result })
        }
        else {
            res.status(404).send({ NIN, exists: result })

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};
