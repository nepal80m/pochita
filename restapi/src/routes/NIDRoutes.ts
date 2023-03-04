import { Router } from 'express';
import { queryAllNationalIdentities, createNationalIdentity, queryNationalIdentity, updateNationalIdentity, deleteNationalIdentity, checkIfNationalIdentityExists, getLastUpdatedDate } from '../controllers/NIDControllers';
import auth from '../middlewares/auth';
const NIDRouter = Router();

NIDRouter.get("/", auth, queryAllNationalIdentities)
NIDRouter.post("/", auth, createNationalIdentity)
NIDRouter.get("/:NIN", auth, queryNationalIdentity)
NIDRouter.get("/check/:NIN", checkIfNationalIdentityExists)
NIDRouter.get("/last-updated-date/:NIN", getLastUpdatedDate)
NIDRouter.put("/:NIN", auth, updateNationalIdentity)
NIDRouter.delete("/:NIN", auth, deleteNationalIdentity)


export default NIDRouter;