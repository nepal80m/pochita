import { Router } from 'express';
import { queryAllDrivingLicenses, createDrivingLicense, queryDrivingLicenseByNIN, updateDrivingLicense, deleteDrivingLicense, checkIfDrivingLicenseExists, getLastUpdatedDate } from '../controllers/DVLControllers';
import auth from '../middlewares/auth';
const DVLRouter = Router();

DVLRouter.get("/", auth, queryAllDrivingLicenses)
DVLRouter.post("/", auth, createDrivingLicense)
DVLRouter.get("/:NIN", auth, queryDrivingLicenseByNIN)
DVLRouter.get("/check/:NIN", checkIfDrivingLicenseExists)
DVLRouter.get("/last-updated-date/:NIN", getLastUpdatedDate)
DVLRouter.put("/:NIN", auth, updateDrivingLicense)
DVLRouter.delete("/:NIN", auth, deleteDrivingLicense)


export default DVLRouter;