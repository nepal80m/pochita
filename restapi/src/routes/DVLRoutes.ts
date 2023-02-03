import { Router } from 'express';
import { queryAllDrivingLicenses, createDrivingLicense, queryDrivingLicenseByNIN, updateDrivingLicense, deleteDrivingLicense, checkIfDrivingLicenseExists } from '../controllers/DVLControllers';
import auth from '../middlewares/auth';
const DVLRouter = Router();

DVLRouter.get("/", auth, queryAllDrivingLicenses)
DVLRouter.post("/", auth, createDrivingLicense)
DVLRouter.get("/:NIN", auth, queryDrivingLicenseByNIN)
DVLRouter.get("/check/:NIN", checkIfDrivingLicenseExists)
DVLRouter.put("/:NIN", auth, updateDrivingLicense)
DVLRouter.delete("/:NIN", auth, deleteDrivingLicense)


export default DVLRouter;