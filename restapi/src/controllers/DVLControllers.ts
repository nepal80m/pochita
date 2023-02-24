import { Request, Response } from 'express';
import { Connection } from '../connection';
const utf8Decoder = new TextDecoder();


export const queryAllDrivingLicenses = async (req: Request, res: Response) => {

    console.log("Requested to query all driving licenses")


    const resultBytes = await Connection.drivingLicenseContract.evaluateTransaction('queryAllDrivingLicenses');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log(`Returning data: ${result}`)
    res.send(result)
};



export const createDrivingLicense = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    console.log(`Requested to create DVL with NIN: {NIN}`)
    console.log(documentDetails)
    if (!NIN || !documentDetails) {
        console.log("NIN or documentDetails missing")
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }
    try {

        const resultBytes = await Connection.drivingLicenseContract.submitTransaction('createDrivingLicense', NIN, JSON.stringify(documentDetails));

        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        console.log(`Created driving license with NIN: ${NIN}`)
        console.log(`Returning data: ${result}`)
        res.send(result)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }





};

export const queryDrivingLicenseByNIN = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Requested to query DVL with NIN: ${NIN}`)
    try {



        const checkResultBytes = await Connection.drivingLicenseContract.evaluateTransaction('checkIfDrivingLicenseExists', NIN);
        const checkResultJson = utf8Decoder.decode(checkResultBytes);
        const exists = JSON.parse(checkResultJson);
        if (exists) {
            console.log("DVL exists")






            const dvlResultBytes = await Connection.drivingLicenseContract.evaluateTransaction('queryDrivingLicenseByNIN', NIN);
            const dvlResultJson = utf8Decoder.decode(dvlResultBytes);
            const dvlResult = JSON.parse(dvlResultJson);

            const nidResultBytes = await Connection.nationalIdentityContract.evaluateTransaction('queryNationalIdentity', NIN);
            const nidResultJson = utf8Decoder.decode(nidResultBytes);
            const nidResult = JSON.parse(nidResultJson);


            dvlResult.face_image = nidResult.face_image;
            dvlResult.first_name = nidResult.first_name;
            dvlResult.first_name_devanagari = nidResult.first_name_devanagari;
            dvlResult.middle_name = nidResult.middle_name;
            dvlResult.middle_name_devanagari = nidResult.middle_name_devanagari;
            dvlResult.last_name = nidResult.last_name;
            dvlResult.last_name_devanagari = nidResult.last_name_devanagari;
            dvlResult.permanent_state = nidResult.permanent_state;
            dvlResult.permanent_district = nidResult.permanent_district;
            dvlResult.permanent_municipality = nidResult.permanent_municipality;
            dvlResult.permanent_ward_number = nidResult.permanent_ward_number;
            dvlResult.permanent_tole = nidResult.permanent_tole;
            dvlResult.date_of_birth = nidResult.date_of_birth;
            dvlResult.father_first_name = nidResult.father_first_name;
            dvlResult.father_middle_name = nidResult.father_middle_name;
            dvlResult.father_last_name = nidResult.father_last_name;
            dvlResult.spouse_first_name = nidResult.spouse_first_name;
            dvlResult.spouse_middle_name = nidResult.spouse_middle_name;
            dvlResult.spouse_last_name = nidResult.spouse_last_name;
            dvlResult.mobile_number = nidResult.mobile_number;

            console.log(`Returning data: ${JSON.stringify(dvlResult)}`)
            res.status(200).send(dvlResult)


        }
        else {
            console.log("DVL does not exist")
            res.status(404).send({ message: "DVL does not exist" })
        }







    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};





export const updateDrivingLicense = async (req: Request, res: Response) => {

    const { NIN, documentDetails } = req.body
    console.log(`Requested to update DVL with NIN: ${NIN}`)
    if (!NIN || !documentDetails) {
        console.log("NIN or documentDetails missing")
        return res.status(400).json({ message: "NIN or documentDetails missing" });
    }

    const resultBytes = await Connection.drivingLicenseContract.submitTransaction('updateDrivingLicense', NIN, JSON.stringify(documentDetails));

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log(`Updated driving license with NIN: ${NIN}`)
    console.log(`Returning data: ${result}`)
    res.send(result)
};


export const deleteDrivingLicense = async (req: Request, res: Response) => {

    const { NIN } = req.params
    console.log(`Requested to delete DVL with NIN: ${NIN}`)

    await Connection.drivingLicenseContract.submitTransaction('deleteDrivingLicense', NIN);
    console.log(`Deleted DVL with NIN: ${NIN}`)


    res.status(404).send({ message: "Deleted the driving license." })
};



export const checkIfDrivingLicenseExists = async (req: Request, res: Response) => {
    const { NIN } = req.params
    console.log(`Requested to check if DVL with NIN: ${NIN} exists`)

    try {

        const resultBytes = await Connection.drivingLicenseContract.evaluateTransaction('checkIfDrivingLicenseExists', NIN);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        if (result) {
            console.log("DVL exists")
            res.status(200).send({ NIN, exists: result })
        }
        else {
            console.log("DVL does not exist")
            res.status(404).send({ NIN, exists: result })

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong." });

    }

};
