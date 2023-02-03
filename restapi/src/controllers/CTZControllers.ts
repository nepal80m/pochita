import { Request, Response } from 'express';
import { Connection } from '../connection';
const utf8Decoder = new TextDecoder();


export const queryAllCitizenships = async (req: Request, res: Response) => {

    console.log("Requested to query all citizenships")


    const resultBytes = await Connection.citizenshipContract.evaluateTransaction('queryAllCitizenships');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log(`Returning data: ${result}`)
    res.send(result)
};



export const createCitizenship = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    console.log(`Requested to create CTZ with NIN: {NIN}`)
    console.log(documentDetails)
    if (!NIN || !documentDetails) {
        console.log("NIN or documentDetails missing")
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }
    try {

        const resultBytes = await Connection.citizenshipContract.submitTransaction('createCitizenship', NIN, JSON.stringify(documentDetails));

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(`Created citizenship with NIN: ${NIN}`)
        console.log(`Returning data: ${result}`)
        res.send(result)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }





};

export const queryCitizenshipByNIN = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Requested to query CTZ with NIN: ${NIN}`)
    try {

        const ctzResultBytes = await Connection.citizenshipContract.evaluateTransaction('queryCitizenshipByNIN', NIN);
        const ctzResultJson = utf8Decoder.decode(ctzResultBytes);
        const ctzResult = JSON.parse(ctzResultJson);

        const nidResultBytes = await Connection.citizenshipContract.evaluateTransaction('queryNationalIdentity', NIN);
        const nidResultJson = utf8Decoder.decode(nidResultBytes);
        const nidResult = JSON.parse(nidResultJson);

        ctzResult.face_image = nidResult.face_image;
        ctzResult.first_name = nidResult.first_name;
        ctzResult.first_name_devanagari = nidResult.first_name_devanagari;
        ctzResult.middle_name = nidResult.middle_name;
        ctzResult.middle_name_devanagari = nidResult.middle_name_devanagari;
        ctzResult.last_name = nidResult.last_name;
        ctzResult.last_name_devanagari = nidResult.last_name_devanagari;
        ctzResult.dob = nidResult.dob;
        ctzResult.birth_state = nidResult.birth_state;
        ctzResult.birth_district = nidResult.birth_district;
        ctzResult.birth_municipality = nidResult.birth_municipality;
        ctzResult.birth_ward = nidResult.birth_ward;
        ctzResult.birth_tole = nidResult.birth_tole;
        ctzResult.permanent_state = nidResult.permanent_state;
        ctzResult.permanent_district = nidResult.permanent_district;
        ctzResult.permanent_municipality = nidResult.permanent_municipality;
        ctzResult.permanent_ward = nidResult.permanent_ward;
        ctzResult.permanent_tole = nidResult.permanent_tole;
        ctzResult.father_first_name = nidResult.father_first_name;
        ctzResult.father_middle_name = nidResult.father_middle_name;
        ctzResult.father_last_name = nidResult.father_last_name;
        ctzResult.mother_first_name = nidResult.mother_first_name;
        ctzResult.mother_middle_name = nidResult.mother_middle_name;
        ctzResult.mother_last_name = nidResult.mother_last_name;


        console.log(`Returning data: ${ctzResult}`)
        res.status(200).send(ctzResult)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};





export const updateCitizenship = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    console.log(`Requested to update CTZ with NIN: ${NIN}`)
    if (!NIN || !documentDetails) {
        console.log("NIN or documentDetails missing")
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }

    const resultBytes = await Connection.citizenshipContract.submitTransaction('updateCitizenship', NIN, JSON.stringify(documentDetails));

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log(`Updated citizenship with NIN: ${NIN}`)
    console.log(`Returning data: ${result}`)
    res.send(result)
};


export const deleteCitizenship = async (req: Request, res: Response) => {

    const { NIN } = req.params
    console.log(`Requested to delete CTZ with NIN: ${NIN}`)

    await Connection.citizenshipContract.submitTransaction('deleteCitizenship', NIN);
    console.log(`Deleted citizenship with NIN: ${NIN}`)


    res.status(404).send({ message: "Deleted the citizenship." })
};



export const checkIfCitizenshipExists = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Requested to check if CTZ with NIN: ${NIN} exists`)

    try {

        const resultBytes = await Connection.citizenshipContract.evaluateTransaction('checkIfCitizenshipExists', NIN);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        if (result) {
            console.log("CTZ exists")
            res.status(200).send({ NIN, exists: result })
        }
        else {
            console.log("CTZ does not exist")
            res.status(404).send({ NIN, exists: result })

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};
